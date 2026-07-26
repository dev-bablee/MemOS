$root = "c:\Users\LOQ\MemOS\apps\web"
if (!(Test-Path $root)) { New-Item -ItemType Directory -Force -Path $root | Out-Null }

$folders = @(
    "app/(marketing)",
    "app/(auth)/login",
    "app/(auth)/signup",
    "app/(dashboard)/dashboard",
    "app/(dashboard)/memory",
    "app/(dashboard)/agents",
    "app/(dashboard)/projects",
    "app/(dashboard)/search",
    "app/(dashboard)/settings",
    "app/(dashboard)/profile",
    "app/api",
    "components/ui",
    "components/layout",
    "components/dashboard",
    "components/sidebar",
    "components/navbar",
    "components/memory",
    "components/agents",
    "components/projects",
    "components/settings",
    "components/common",
    "components/forms",
    "components/charts",
    "components/modals",
    "components/providers",
    "components/theme",
    "hooks",
    "services/api",
    "services/socket",
    "services/auth",
    "services/memory",
    "services/agent",
    "services/project",
    "services/search",
    "stores",
    "types",
    "validation",
    "lib/utils",
    "lib/config",
    "lib/constants",
    "lib/helpers",
    "providers",
    "public/images",
    "public/icons",
    "public/logo",
    "public/fonts",
    "styles",
    "config",
    "tests/unit",
    "tests/integration",
    "tests/e2e"
)

$features = @("auth", "memory", "agents", "projects", "search", "profile", "settings")
foreach ($f in $features) {
    $folders += "features/$f/components"
    $folders += "features/$f/hooks"
    $folders += "features/$f/services"
    $folders += "features/$f/types"
    $folders += "features/$f/utils"
    $folders += "features/$f/validation"
    $folders += "features/$f/store"
}

foreach ($folder in $folders) {
    $path = Join-Path $root $folder
    if (!(Test-Path $path)) { New-Item -ItemType Directory -Force -Path $path | Out-Null }
}

function Create-File($path, $content) {
    $fullPath = Join-Path $root $path
    if (!(Test-Path $fullPath)) {
        Set-Content -Path $fullPath -Value $content -Encoding UTF8
    }
}

# App Router
Create-File "app/layout.tsx" "export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html><body>{children}</body></html>); }"
Create-File "app/page.tsx" "export default function LandingPage() { return <main>MemOS Landing Page</main>; }"
Create-File "app/error.tsx" "'use client'; export default function ErrorPage() { return <div>Something went wrong</div>; }"
Create-File "app/loading.tsx" "export default function Loading() { return <div>Loading...</div>; }"
Create-File "app/not-found.tsx" "export default function NotFound() { return <div>404 Not Found</div>; }"

Create-File "app/(auth)/login/page.tsx" "export default function LoginPage() { return <div>Login Page</div>; }"
Create-File "app/(auth)/signup/page.tsx" "export default function SignupPage() { return <div>Signup Page</div>; }"

Create-File "app/(dashboard)/dashboard/page.tsx" "export default function DashboardPage() { return <div>Dashboard</div>; }"
Create-File "app/(dashboard)/memory/page.tsx" "export default function MemoryPage() { return <div>Memory Management</div>; }"
Create-File "app/(dashboard)/agents/page.tsx" "export default function AgentsPage() { return <div>AI Agents</div>; }"
Create-File "app/(dashboard)/projects/page.tsx" "export default function ProjectsPage() { return <div>Projects</div>; }"
Create-File "app/(dashboard)/search/page.tsx" "export default function SearchPage() { return <div>Search</div>; }"
Create-File "app/(dashboard)/settings/page.tsx" "export default function SettingsPage() { return <div>Settings</div>; }"
Create-File "app/(dashboard)/profile/page.tsx" "export default function ProfilePage() { return <div>Profile</div>; }"

# Placeholder index files in components
$compFolders = "ui","layout","dashboard","sidebar","navbar","memory","agents","projects","settings","common","forms","charts","modals","providers","theme"
foreach ($c in $compFolders) {
    Create-File "components/$c/index.ts" "// Export $c components here"
}

# Hooks
$hooks = "useAuth.ts","useMemory.ts","useAgent.ts","useProject.ts","useSocket.ts","useTheme.ts","useDebounce.ts","useLocalStorage.ts"
foreach ($h in $hooks) {
    Create-File "hooks/$h" "export const ${h%.ts} = () => {};"
}

# Services placeholders
$services = "api","socket","auth","memory","agent","project","search"
foreach ($s in $services) {
    Create-File "services/$s/index.ts" "// Export $s service functions here"
}

# Stores
$stores = "authStore.ts","memoryStore.ts","agentStore.ts","projectStore.ts","uiStore.ts","themeStore.ts"
foreach ($s in $stores) {
    Create-File "stores/$s" "import { create } from 'zustand';`n`nexport const use${s%.ts} = create((set) => ({}));"
}

# Types
$types = "auth.ts","memory.ts","agent.ts","project.ts","api.ts","common.ts"
foreach ($t in $types) {
    Create-File "types/$t" "// Type definitions for $t"
}

# Validation
$validations = "login.ts","signup.ts","memory.ts","project.ts","profile.ts","settings.ts"
foreach ($v in $validations) {
    Create-File "validation/$v" "import { z } from 'zod';`n`nexport const schema = z.object({});"
}

# Config
Create-File "config/env.ts" "export const env = {};"
Create-File "config/site.ts" "export const siteConfig = {};"
Create-File "config/navigation.ts" "export const navigation = [];"
Create-File "config/sidebar.ts" "export const sidebar = [];"
Create-File "config/api.ts" "export const apiConfig = {};"
Create-File "config/socket.ts" "export const socketConfig = {};"

# Context Providers
Create-File "providers/ThemeProvider.tsx" "export function ThemeProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }"
Create-File "providers/QueryProvider.tsx" "export function QueryProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }"
Create-File "providers/SocketProvider.tsx" "export function SocketProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }"
Create-File "providers/AuthProvider.tsx" "export function AuthProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }"

# Styles
Create-File "styles/globals.css" "@tailwind base;`n@tailwind components;`n@tailwind utilities;"
Create-File "styles/tailwind.css" "/* Tailwind custom overrides */"
Create-File "styles/theme.css" "/* CSS variables for theme */"
Create-File "styles/animations.css" "/* Custom animations */"

# Features Index
foreach ($f in $features) {
    Create-File "features/$f/index.ts" "// Export feature $f components, hooks, services, etc."
    Create-File "features/$f/components/index.ts" "// Export components"
    Create-File "features/$f/hooks/index.ts" "// Export hooks"
    Create-File "features/$f/services/index.ts" "// Export services"
    Create-File "features/$f/types/index.ts" "// Export types"
    Create-File "features/$f/utils/index.ts" "// Export utils"
    Create-File "features/$f/validation/index.ts" "// Export validation"
    Create-File "features/$f/store/index.ts" "// Export store"
}

# Lib Index files
Create-File "lib/utils/index.ts" "// Utilities"
Create-File "lib/config/index.ts" "// Config"
Create-File "lib/constants/index.ts" "// Constants"
Create-File "lib/helpers/index.ts" "// Helpers"

# Documentation
Create-File "README.md" "# MemOS Frontend`n`nNext.js 15 App Router Frontend for MemOS."
Create-File "ARCHITECTURE.md" "# Frontend Architecture`n`nFeature-based architecture documentation."
Create-File "CONTRIBUTING.md" "# Contributing Guidelines`n`nHow to contribute to the frontend."

Write-Host "Frontend project structure successfully generated at $root"
