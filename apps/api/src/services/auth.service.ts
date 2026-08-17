import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserRepository, UserEntity } from "../repositories/user.repository.js";
import { TenantRepository } from "../repositories/tenant.repository.js";
import { ApiKeyRepository, ApiKeyEntity } from "../repositories/api-key.repository.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error-handler.js";

export class AuthService {
  static async signup(data: {
    name: string;
    email: string;
    password: string;
    organizationName?: string;
  }): Promise<{ user: Omit<UserEntity, "password_hash">; token: string; tenantId: string }> {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("An account with this email already exists", 409, "USER_EXISTS");
    }

    // Create Tenant
    const orgName = data.organizationName || `${data.name}'s Organization`;
    const slug = `${orgName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
    const tenant = await TenantRepository.create({ name: orgName, slug });

    // Hash Password & Create User
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await UserRepository.create({
      tenant_id: tenant.id,
      email: data.email,
      password_hash: passwordHash,
      name: data.name,
      role: "admin",
    });

    const token = this.generateToken(user);
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      tenantId: tenant.id,
    };
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: Omit<UserEntity, "password_hash">; token: string; tenantId: string }> {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = this.generateToken(user);
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      tenantId: user.tenant_id,
    };
  }

  static async getCurrentUser(userId: string): Promise<Omit<UserEntity, "password_hash">> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async createApiKey(data: {
    tenantId: string;
    name: string;
    scopes?: string[];
    expiresInDays?: number;
  }): Promise<{ apiKey: ApiKeyEntity; rawKey: string }> {
    const rawSecret = crypto.randomBytes(24).toString("hex");
    const rawKey = `mem_live_${rawSecret}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 86400000)
      : null;

    const apiKey = await ApiKeyRepository.create({
      tenant_id: data.tenantId,
      name: data.name,
      key_hash: keyHash,
      prefix: "mem_live_",
      scopes: data.scopes || ["*"],
      expires_at: expiresAt,
    });

    return { apiKey, rawKey };
  }

  static async listApiKeys(tenantId: string): Promise<ApiKeyEntity[]> {
    return ApiKeyRepository.listByTenant(tenantId);
  }

  static async deleteApiKey(id: string, tenantId: string): Promise<boolean> {
    return ApiKeyRepository.delete(id, tenantId);
  }

  private static generateToken(user: UserEntity): string {
    return jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }
}
