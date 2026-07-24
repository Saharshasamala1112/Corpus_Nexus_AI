# UI/UX Specification

## CorpusGuard AI Assistant — Frontend Design Document

| Field | Detail |
|---|---|
| **Document Title** | UI/UX Specification — CorpusGuard AI Assistant |
| **Module** | CorpusGuard AI |
| **Platform** | Corpus Nexus AI |
| **Version** | 1.0 |
| **Author** | Saharsha |
| **Status** | Draft |
| **Last Updated** | 2026-07-22 |

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Navigation Flow](#3-navigation-flow)
4. [Layout Architecture](#4-layout-architecture)
5. [Component Specifications](#5-component-specifications)
6. [UI Specification](#6-ui-specification)
7. [Color System & Dark Mode](#7-color-system--dark-mode)
8. [Typography](#8-typography)
9. [Spacing & Grid](#9-spacing--grid)
10. [Responsive Behavior](#10-responsive-behavior)
11. [States & Transitions](#11-states--transitions)
12. [Accessibility](#12-accessibility)
13. [User Journey](#13-user-journey)
14. [Folder Structure](#14-folder-structure)

---

## 1. Design Principles

| # | Principle | Meaning |
|---|---|---|
| 1 | **Grounded** | Every UI element communicates that answers come from real company knowledge — citations are always visible, never hidden behind a click |
| 2 | **Minimal chrome** | No visual noise. The interface disappears so the user focuses on the conversation and the knowledge |
| 3 | **Progressive disclosure** | Show a simple chat first. Advanced panels (sources, schema, explorer) appear on demand, not by default |
| 4 | **Consistency** | Match the design language of the existing Corpus Nexus AI platform — same fonts, spacing, nav, and color tokens |
| 5 | **Speed perception** | Streaming tokens, skeleton loaders, optimistic UI — the user must never feel the system is slow |
| 6 | **Enterprise trust** | Clean, professional, no novelty. This is a tool, not a toy. Think Linear, not Notion |

### Design References

| Reference | What to Borrow |
|---|---|
| **ChatGPT** | Left sidebar conversation list, clean input area, streaming response |
| **Cursor AI** | Right context panel, code-first presentation, file references |
| **GitHub Copilot Enterprise** | Source citations inline, enterprise-grade spacing, muted palette |
| **Claude AI** | Welcome screen design, suggested questions layout, response formatting |

---

## 2. Component Hierarchy

```
App
│
├── MainLayout (shared across all modules)
│   ├── Navbar (shared — top navigation bar)
│   ├── PlatformSidebar (shared — left nav for module switching)
│   └── PageContent (outlet for routes)
│
├── FloatingAIButton (global — fixed bottom-right on ALL pages)
│
└── CorpusGuardPage (/ai-assistant — FULL-PAGE, replaces layout)
    │
    ├── ConversationSidebar (left panel)
    │   ├── SidebarHeader
    │   │   ├── Logo / Brand
    │   │   └── NewChatButton
    │   ├── SearchInput
    │   ├── ConversationGroup
    │   │   ├── GroupLabel ("Today", "Yesterday", "Previous 7 Days")
    │   │   └── ConversationItem[] (per chat session)
    │   │       ├── ConversationIcon
    │   │       ├── ConversationTitle
    │   │       ├── LastMessagePreview
    │   │       └── DeleteAction (hover)
    │   └── SidebarFooter
    │       ├── UserAvatar
    │       ├── UserName
    │       └── SettingsButton
    │
    ├── MainWorkspace (center)
    │   │
    │   ├── WelcomeState (shown when no active conversation)
    │   │   ├── BrandMark (icon + name)
    │   │   ├── WelcomeHeadline ("What can I help you with?")
    │   │   ├── WelcomeSubtext ("Ask about any project, code, API, or architecture")
    │   │   └── SuggestedQuestions
    │   │       ├── SuggestedCard[] (7 cards, 2-column grid)
    │   │       │   ├── CardIcon (topic-specific)
    │   │       │   ├── CardQuestion
    │   │       │   └── CardArrow
    │   │       └── ExampleQueries (smaller text below grid)
    │   │
    │   ├── ChatState (shown when active conversation exists)
    │   │   ├── MessageList (scrollable)
    │   │   │   ├── UserMessage[] (right-aligned bubbles)
    │   │   │   │   └── MessageText
    │   │   │   ├── AssistantMessage[] (left-aligned, full-width)
    │   │   │   │   ├── AssistantAvatar
    │   │   │   │   ├── ResponseContent
    │   │   │   │   │   ├── MarkdownRenderer
    │   │   │   │   │   ├── CodeBlock (with copy button, language label)
    │   │   │   │   │   └── StreamingCursor (animated, during generation)
    │   │   │   │   ├── CitationInline[] (numbered badges: [1] [2] [3])
    │   │   │   │   ├── SourceStrip (horizontal scrollable chips below response)
    │   │   │   │   │   ├── SourceChip[] (file icon + path + repo)
    │   │   │   │   │   └── ViewAllSourcesButton
    │   │   │   │   └── MessageActions
    │   │   │   │       ├── CopyButton
    │   │   │   │       ├── ThumbsUp
    │   │   │   │       ├── ThumbsDown
    │   │   │   │       └── RegenerateButton
    │   │   │   ├── ToolCallIndicator[] (collapsible)
    │   │   │   │   ├── ToolIcon
    │   │   │   │   ├── ToolName ("Searching code...")
    │   │   │   │   └── ToolStatus (spinner → checkmark)
    │   │   │   └── LoadingIndicator (thinking state)
    │   │   │
    │   │   └── InputArea (sticky bottom)
    │   │       ├── InputContainer
    │   │       │   ├── FileMentionButton (optional @ mention)
    │   │       │   ├── TextArea (auto-resize, 1-6 lines)
    │   │       │   └── SendButton (enabled when text present)
    │   │       ├── InputHints
    │   │       │   ├── KeyboardShortcuts ("Shift+Enter for new line")
    │   │       │   └── ContextIndicator (showing scoped repos)
    │   │       └── DisclaimerText ("CorpusGuard uses AI. Verify critical info.")
    │
    └── ContextPanel (right panel, toggleable)
        │
        ├── PanelHeader
        │   ├── PanelTitle ("Context")
        │   └── CollapseButton
        │
        ├── PanelTabs
        │   ├── SourcesTab (default active)
        │   │   ├── SourceGroup[] (grouped by type)
        │   │   │   ├── GroupHeader ("Code", "Documentation", "API", "Schema")
        │   │   │   └── SourceItem[]
        │   │   │       ├── FileIcon (language/color-coded)
        │   │   │       ├── FileName
        │   │   │       ├── FilePath (muted, truncated)
        │   │   │       ├── RelevanceBar (visual confidence indicator)
        │   │   │       └── OpenAction
        │   │   └── EmptyState ("Ask a question to see sources")
        │   │
        │   ├── ProjectsTab
        │   │   ├── ProjectCard[]
        │   │   │   ├── ProjectName
        │   │   │   ├── PrimaryLanguage
        │   │   │   ├── Description
        │   │   │   └── LastUpdated
        │   │   └── EmptyState
        │   │
        │   ├── APITab
        │   │   ├── EndpointItem[]
        │   │   │   ├── MethodBadge (GET/POST/PUT/DELETE color-coded)
        │   │   │   ├── Path
        │   │   │   └── Description
        │   │   └── EmptyState
        │   │
        │   ├── SchemaTab
        │   │   ├── TableCard[]
        │   │   │   ├── TableName
        │   │   │   ├── ColumnList[] (name, type, constraints)
        │   │   │   └── Relationships[] (FK references)
        │   │   └── EmptyState
        │   │
        │   └── DocsTab
        │       ├── DocumentItem[]
        │       │   ├── DocIcon
        │       │   ├── DocTitle
        │       │   ├── DocType ("PDF", "Markdown", "DOCX")
        │       │   └── PreviewSnippet
        │       └── EmptyState
        │
        └── PanelFooter
            └── ConfidenceIndicator (overall retrieval confidence score)
```

---

## 3. Navigation Flow

### 3.1 Entry Points

```
ENTRY POINT 1: Floating Button (Global)
───────────────────────────────────────
Every page in Corpus Nexus AI
    │
    ▼
FloatingAIButton (bottom-right, fixed)
    │
    │ click
    ▼
Navigate to /ai-assistant
(Full-page takeover, not a popup)


ENTRY POINT 2: Direct URL
──────────────────────────
User navigates to /ai-assistant directly
    │
    ▼
Loads CorpusGuardPage with WelcomeState


ENTRY POINT 3: Sidebar Navigation
──────────────────────────────────
PlatformSidebar → "AI Assistant" menu item
    │
    ▼
Navigate to /ai-assistant
```

### 3.2 Page Navigation Map

```
                         ┌─────────────────────┐
                         │    Any Platform Page │
                         │   (Dashboard, Sprint │
                         │    Explorer, etc.)   │
                         └──────────┬──────────┘
                                    │
                         FloatingAIButton click
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────┐
│                        /ai-assistant                              │
│                                                                   │
│  ┌─────────┐  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │         │  │                          │  │                 │  │
│  │  Conv.  │  │     Main Workspace       │  │    Context      │  │
│  │ Sidebar │  │                          │  │    Panel        │  │
│  │         │  │  WelcomeState ────────── │  │   (toggleable)  │  │
│  │  New    │  │      │                   │  │                 │  │
│  │  Chat   │  │      │ click suggestion  │  │  Sources        │  │
│  │  ─────  │  │      ▼                   │  │  Projects       │  │
│  │  Today  │  │  ChatState ──────────── │  │  APIs           │  │
│  │  ─────  │  │      │                   │  │  Schema         │  │
│  │  Older  │  │      │ send message      │  │  Docs           │  │
│  │         │  │      ▼                   │  │                 │  │
│  │  User   │  │  StreamingResponse ──── │  │                 │  │
│  │  Profile│  │      │                   │  │                 │  │
│  │         │  │      │ click source      │  │                 │  │
│  │         │  │      ▼                   │  │                 │  │
│  │         │  │  SourceDetail (panel)    │  │                 │  │
│  │         │  │                          │  │                 │  │
│  └─────────┘  └──────────────────────────┘  └─────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  InputArea: [file mention] [text input...............] [→]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### 3.3 State Transitions

```
WELCOME STATE  ←────── Initial load, no active session
     │                 (or "New Chat" clicked)
     │
     │ user sends first message OR clicks suggested question
     ▼
LOADING STATE  ←────── Brief (200-500ms) while retrieval begins
     │                 Shows skeleton + "Thinking..." indicator
     │
     ▼
STREAMING STATE ←──── Tokens arriving via SSE
     │                 Live markdown rendering
     │                 Tool calls shown inline
     │                 Right panel populates with sources
     │
     ▼
COMPLETE STATE ←──── Response fully delivered
     │                 Source strip visible
     │                 Feedback buttons enabled
     │                 Context panel shows all retrieved sources
     │
     ▼
FOLLOW-UP STATE ←──── User asks follow-up in same session
     │                 Conversation history visible
     │                 Context carries over
     │
     ▼
[new message → LOADING STATE → STREAMING STATE → ...]

At any point:
  → NEW CHAT click → WELCOME STATE
  → DELETE conversation → remove from sidebar, return to WELCOME STATE
  → TOGGLE context panel → show/hide right panel
```

---

## 4. Layout Architecture

### 4.1 Full-Page Layout (3-Column)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 100vw × 100vh                                                           │
│                                                                          │
│ ┌────────────┬──────────────────────────────────┬────────────────────┐   │
│ │            │                                  │                    │   │
│ │  260px     │         flex: 1                  │    340px           │   │
│ │  fixed     │         (fills remaining)        │    toggleable      │   │
│ │            │                                  │                    │   │
│ │  Conv.     │      Main Workspace              │    Context         │   │
│ │  Sidebar   │                                  │    Panel           │   │
│ │            │  ┌──────────────────────────┐    │                    │   │
│ │            │  │                          │    │  ┌──────────────┐  │   │
│ │  ┌──────┐  │  │   Messages / Welcome     │    │  │  Sources     │  │   │
│ │  │ New  │  │  │                          │    │  │  Projects    │  │   │
│ │  │ Chat │  │  │   (scrollable)           │    │  │  APIs        │  │   │
│ │  └──────┘  │  │                          │    │  │  Schema      │  │   │
│ │            │  │                          │    │  │  Docs        │  │   │
│ │  [Search]  │  ├──────────────────────────┤    │  └──────────────┘  │   │
│ │            │  │                          │    │                    │   │
│ │  Conv.     │  │   Input Area             │    │                    │   │
│ │  List      │  │   (sticky bottom)        │    │                    │   │
│ │            │  │                          │    │                    │   │
│ │            │  └──────────────────────────┘    │                    │   │
│ │            │                                  │                    │   │
│ └────────────┴──────────────────────────────────┴────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Breakpoints:
  ≥ 1280px  →  3-column (sidebar + workspace + context panel)
  1024-1279 →  2-column (sidebar collapsed to icons + workspace + context panel)
  < 1024    →  1-column (sidebar hidden, context panel as overlay)
```

### 4.2 Floating AI Button

```
┌─────────────────────────────────────────────┐
│                                             │
│  Any Page in Corpus Nexus AI                │
│                                             │
│                                             │
│                                             │
│                                             │
│                                     ┌────┐  │
│                                     │ AI │  │
│                                     │  ✦ │  │
│                                     └────┘  │
│                                             │
└─────────────────────────────────────────────┘

Position:     fixed, bottom: 24px, right: 24px
Size:         56px × 56px (circular)
Background:   Primary brand gradient (blue → violet)
Shadow:       0 4px 24px rgba(0, 0, 0, 0.15)
Z-index:      9999
Icon:         Sparkle/star icon (24px), white
Hover:        Scale 1.05, shadow intensifies
Active:       Scale 0.95 (press feedback)
Animation:    Subtle pulse on first visit (3 cycles, then stops)
Tooltip:      "CorpusGuard AI Assistant" (appears on hover after 500ms)
```

---

## 5. Component Specifications

### 5.1 ConversationSidebar

```
┌──────────────────────────────┐
│ ◉ CorpusGuard AI        [+] │  ← Header: brand + New Chat button
├──────────────────────────────┤
│ 🔍 Search conversations...   │  ← Search input
├──────────────────────────────┤
│ TODAY                        │  ← Group label
│ ├─ How to set up Docker      │  ← Active item (highlighted)
│ ├─ PostgreSQL schema for...  │
│ └─ Which project uses Redis  │
│                              │
│ YESTERDAY                    │
│ ├─ Explain backend arch...   │
│ └─ Login API endpoint        │
│                              │
│ PREVIOUS 7 DAYS              │
│ ├─ Authentication flow       │
│ └─ Environment variables     │
├──────────────────────────────┤
│ 👤 Saharsha          ⚙️     │  ← User info + settings
└──────────────────────────────┘

Width:        260px (expanded), 64px (collapsed, icons only)
Background:   Surface-0 (light) / Surface-900 (dark)
Border-right: 1px solid Border
Padding:      12px horizontal

ConversationItem:
  Height:       40px
  Padding:      8px 12px
  Border-radius: 8px
  Hover:        Background-Surface-100
  Active:       Background-Primary-50, text Primary-600
  Text-size:    14px
  Max-lines:    1 (truncated with ellipsis)
  Delete:       Appears on hover (right side, trash icon)

NewChatButton:
  Width:        100% of sidebar
  Height:       40px
  Background:   Primary-600
  Text:         "New Chat"
  Icon:         Plus icon (left)
  Border-radius: 8px
  Hover:        Primary-700
```

### 5.2 WelcomeState

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  ◉ (brand icon, 48px)               │
│                                                     │
│          What can I help you with?                   │  ← H1, 28px, semi-bold
│                                                     │
│   Ask about any project, code, API, or architecture │  ← Subtitle, 16px, muted
│                                                     │
│   ┌─────────────────────┐ ┌─────────────────────┐  │
│   │ 💻                  │ │ 🏗️                  │  │
│   │ Explain our backend │ │ How do I run this   │  │
│   │ architecture.       │ │ project?            │  │
│   └─────────────────────┘ └─────────────────────┘  │
│   ┌─────────────────────┐ ┌─────────────────────┐  │
│   │ 🗄️                  │ │ 🐳                  │  │
│   │ Show PostgreSQL     │ │ Explain Docker      │  │
│   │ schema.             │ │ setup.              │  │
│   └─────────────────────┘ └─────────────────────┘  │
│   ┌─────────────────────┐ ┌─────────────────────┐  │
│   │ 🔐                  │ │ 🔌                  │  │
│   │ Explain             │ │ Show login API.     │  │
│   │ authentication flow.│ │                     │  │
│   └─────────────────────┘ └─────────────────────┘  │
│   ┌─────────────────────────────────────────────┐  │
│   │ 📦                  Which project uses Redis?│  │
│   └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

Layout:
  Grid:          2 columns, gap 12px
  Max-width:     640px (centered)
  Card height:   auto (content-driven)
  Card padding:  16px
  Card border:   1px solid Border
  Card radius:   12px
  Card hover:    border Primary-300, shadow elevation-1
  Card click:    populates input with question text

Suggested Questions (data):

  [
    { icon: "code",     text: "Explain our backend architecture." },
    { icon: "play",     text: "How do I run this project?" },
    { icon: "database", text: "Which project uses Redis?" },
    { icon: "docker",   text: "Explain Docker setup." },
    { icon: "api",      text: "Show login API." },
    { icon: "schema",   text: "Show PostgreSQL schema." },
    { icon: "auth",     text: "Explain authentication flow." }
  ]
```

### 5.3 ChatMessage — User

```
                    ┌───────────────────────────────┐
                    │ How do I run this project?     │
                    └───────────────────────────────┘
                                            ← right-aligned

Alignment:      Right
Max-width:      70% of workspace
Background:     Primary-600 (light) / Primary-500 (dark)
Text-color:     White
Padding:        12px 16px
Border-radius:  16px 16px 4px 16px (bottom-left smaller)
Font-size:      15px
Line-height:    1.5
```

### 5.4 ChatMessage — Assistant

```
┌────┐ ┌──────────────────────────────────────────────────┐
│  ◉ │ │ To run this project, follow these steps:         │
│    │ │                                                  │
└────┘ │ 1. Clone the repository                          │
       │ ```bash                                          │
       │ git clone https://github.com/org/project.git     │
       │ ```                                              │
       │ 2. Copy environment file:                        │
       │ ```bash                                          │
       │ cp .env.example .env                             │
       │ ```                                              │
       │ 3. Start with Docker Compose:                    │
       │ ```bash                                          │
       │ docker-compose up -d                             │
       │ ```                                              │
       │                                                  │
       │ [1] README.md  [2] docker-compose.yml  [3] .env  │
       │                                                  │
       │ 👍  👎  📋  🔄                                   │
       │                                                  │
       └──────────────────────────────────────────────────┘

Layout:         Left-aligned, full width
Avatar:         32px circle, brand color background, white icon
Max-width:      100% (content-driven, not constrained)
Content:        Rendered Markdown (GFM compatible)
Padding:        16px left (after avatar), 12px vertical
Font-size:      15px

Code Blocks:
  Background:     Surface-100 (light) / Surface-800 (dark)
  Border-radius:  8px
  Font-family:    JetBrains Mono / Fira Code
  Font-size:      13px
  Header bar:     Language label (left) + Copy button (right)
  Copy feedback:  "Copied!" tooltip for 2 seconds

Citations (inline):
  Style:          Numbered superscript badges [1] [2] [3]
  Color:          Primary-600 background, white text
  Size:           18px × 18px circle
  Click:          Scrolls to SourceStrip, highlights corresponding chip

SourceStrip (below response):
  Layout:         Horizontal scrollable row of chips
  Chip:           File icon + filename (e.g., "README.md")
  Chip-size:      Smaller text (13px), pill shape
  Chip-click:     Opens file in context panel or new tab
  Max visible:    4 chips, then "+N more" overflow

MessageActions (below SourceStrip):
  Layout:         Horizontal row of icon buttons
  Buttons:        Copy (clipboard), ThumbsUp, ThumbsDown, Regenerate
  Size:           16px icons, 32px hit target
  Color:          Text-400 (muted), hover: Text-700
  Copy click:     Copies full response as Markdown
  Regenerate:     Re-sends last message, replaces response
```

### 5.5 ToolCallIndicator

```
┌──────────────────────────────────┐
│ 🔍 Searching codebase...    ✓   │  ← Completed
├──────────────────────────────────┤
│ 📄 Reading docker-compose.yml ✓ │  ← Completed
├──────────────────────────────────┤
│ 🗄️ Querying database schema...  │  ← In progress (spinner)
└──────────────────────────────────┘

Style:          Collapsible (default: expanded during streaming, collapsed after)
Background:     Surface-50 (light) / Surface-800 (dark)
Border:         1px solid Border
Border-radius:  8px
Padding:        8px 12px
Row-height:     32px
Icon:           16px, topic-specific (search, file, database)
Status:         Spinner (in progress) / checkmark (complete) / X (failed)
Animation:      Spinner rotates, checkmark fades in
```

### 5.6 InputArea

```
┌──────────────────────────────────────────────────────────────┐
│ 📎  Ask CorpusGuard anything about your codebase...     [→] │
├──────────────────────────────────────────────────────────────┤
│ Shift+Enter for new line · Scoped to: All repositories      │
│ ⚠️ AI-generated answers. Always verify critical information. │
└──────────────────────────────────────────────────────────────┘

Position:       Sticky bottom of MainWorkspace
Background:     Surface-0 (light) / Surface-900 (dark)
Border-top:     1px solid Border
Padding:        16px horizontal, 12px vertical

InputContainer:
  Background:     Surface-50 (light) / Surface-800 (dark)
  Border:         1px solid Border
  Border-radius:  12px
  Padding:        12px
  Focus-border:   Primary-500
  Transition:     border-color 200ms ease

TextArea:
  Min-height:     24px (1 line)
  Max-height:     144px (6 lines)
  Auto-resize:    Yes (grows with content)
  Font-size:      15px
  Placeholder:    "Ask CorpusGuard anything about your codebase..."
  Placeholder-color: Text-400

SendButton:
  Position:       Bottom-right of InputContainer
  Size:           36px × 36px
  Shape:          Circle
  Background:     Primary-600 (enabled) / Surface-200 (disabled)
  Icon:           Arrow-up (20px, white)
  Disabled:       When input is empty
  Hover:          Primary-700

FileMentionButton:
  Position:       Left of InputContainer
  Size:           24px icon
  Icon:           Paperclip / @ symbol
  Click:          Opens repo/file picker to scope query
  Tooltip:        "Mention a file or repository"
```

### 5.7 ContextPanel (Right)

```
┌──────────────────────────────────┐
│ Context                    [−]   │  ← Panel header
├──────────────────────────────────┤
│ Sources │ Projects │ API │ ...   │  ← Tab bar
├──────────────────────────────────┤
│                                  │
│ ▼ CODE                           │  ← Source group
│ ┌────────────────────────────┐   │
│ │ 🟦 main.py        ████░░  │   │  ← Source item (4/5 relevance)
│ │    backend/app/main.py     │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 🟩 config.py      ███░░░  │   │  ← Lower relevance
│ │    backend/app/core/       │   │
│ └────────────────────────────┘   │
│                                  │
│ ▼ DOCUMENTATION                  │
│ ┌────────────────────────────┐   │
│ │ 📄 README.md      █████░  │   │
│ │    Top match               │   │
│ └────────────────────────────┘   │
│                                  │
│ ▼ API SPECIFICATIONS             │
│ ┌────────────────────────────┐   │
│ │ 🟠 POST /auth/login        │   │
│ │    Authentication endpoint │   │
│ └────────────────────────────┘   │
│                                  │
│ ▼ DATABASE SCHEMA                │
│ ┌────────────────────────────┐   │
│ │ 🗄️ users                   │   │
│ │    id, email, name, role   │   │
│ └────────────────────────────┘   │
│                                  │
├──────────────────────────────────┤
│ Confidence: ████████░░ 82%       │  ← Footer confidence bar
└──────────────────────────────────┘

Width:          340px (expanded)
Collapsed:      0px (with toggle button visible at workspace edge)

Tabs:
  Style:          Underline active indicator
  Active:         Primary-600 text, 2px bottom border
  Inactive:       Text-500, no border
  Font-size:      13px, semi-bold

SourceItem:
  Padding:        10px 12px
  Border-bottom:  1px solid Border-subtle
  Hover:          Background-Surface-50
  Click:          Opens file in full view (or expands inline)
  Relevance bar:  60px wide, filled proportional to score
                  Color: Green (>0.7), Yellow (0.4-0.7), Red (<0.4)

EmptyState:
  Text:           "Ask a question to see relevant sources"
  Icon:           Document icon, muted, 40px
  Centered:       Yes
```

### 5.8 MarkdownRenderer

```
Supported Elements:
  ├── Headings (H1-H4) — styled, not rendered as huge text
  ├── Paragraphs — 15px, 1.6 line-height
  ├── Bold, Italic, Strikethrough
  ├── Inline code — highlighted background, monospace
  ├── Code blocks — with language header bar + copy button
  ├── Ordered / Unordered lists — proper nesting
  ├── Tables — bordered, striped rows
  ├── Links — open in new tab, Primary-600 color
  ├── Blockquotes — left border, muted text
  ├── Horizontal rules — thin separator
  └── Images — max-width 100%, rounded corners

Code Block Layout:
  ┌────────────────────────────────────┐
  │ python                    📋 Copy │  ← Header bar
  ├────────────────────────────────────┤
  │ def authenticate(user):            │  ← Code content
  │     if user.is_active:             │
  │         return generate_token(user)│
  └────────────────────────────────────┘

  Header:     Surface-100 / Surface-800, padding 8px 12px
  Language:   12px, uppercase, muted text
  Copy:       12px, "Copy" text, click copies code content
  Content:    Surface-50 / Surface-850, padding 16px, overflow-x auto
  Font:       JetBrains Mono, 13px
```

---

## 6. UI Specification

### 6.1 Page States

```
STATE 1: WELCOME (Empty, no conversation)
──────────────────────────────────────────
┌────────┬─────────────────────────────────┬──────────┐
│Sidebar │                                 │ Context  │
│        │         [Welcome Banner]         │  Panel   │
│ [New]  │         [Suggested Cards]        │ (empty)  │
│        │                                 │          │
│ [List] │                                 │          │
│        │─────────────────────────────────│          │
│ [User] │  [ Input Area               →]  │          │
└────────┴─────────────────────────────────┴──────────┘

STATE 2: ACTIVE CONVERSATION
─────────────────────────────
┌────────┬─────────────────────────────────┬──────────┐
│Sidebar │                                 │ Context  │
│        │  [User: question]               │  Panel   │
│ [New]  │  [Assistant: response + sources]│ [Sources]│
│        │  [User: follow-up]              │ [Projects│
│ [List] │  [Assistant: streaming...]      │ [APIs]   │
│ active │                                 │ [Schema] │
│ [User] │─────────────────────────────────│ [Docs]   │
│        │  [ Input Area               →]  │          │
└────────┴─────────────────────────────────┴──────────┘

STATE 3: STREAMING IN PROGRESS
───────────────────────────────
┌────────┬─────────────────────────────────┬──────────┐
│Sidebar │                                 │ Context  │
│        │  [User: question]               │  Panel   │
│ [New]  │  [Assistant: partial resp ████] │ Populat- │
│        │            ▊ (cursor)           │ ing in   │
│ [List] │  [Tool: Searching codebase...]  │ real-time│
│        │                                 │          │
│ [User] │─────────────────────────────────│          │
│        │  [ Input Area (disabled)    →]  │          │
└────────┴─────────────────────────────────┴──────────┘

STATE 4: ERROR / NO RESULTS
────────────────────────────
┌────────┬─────────────────────────────────┬──────────┐
│Sidebar │                                 │ Context  │
│        │  [User: question]               │  Panel   │
│ [New]  │  [Assistant: error message]     │ (empty)  │
│        │  ┌─────────────────────────┐    │          │
│ [List] │  │ ⚠️ I couldn't find      │    │          │
│        │  │ relevant information    │    │          │
│ [User] │  │ for this question.      │    │          │
│        │  │ Try rephrasing or...    │    │          │
│        │  └─────────────────────────┘    │          │
│        │─────────────────────────────────│          │
│        │  [ Input Area               →]  │          │
└────────┴─────────────────────────────────┴──────────┘
```

### 6.2 Micro-Interactions

| Interaction | Behavior |
|---|---|
| **Floating button hover** | Scale 1.05, shadow intensifies, tooltip appears after 500ms |
| **Floating button click** | Scale 0.95 (press), navigate to /ai-assistant |
| **New Chat click** | Sidebar slides to welcome state, input focuses |
| **Conversation item hover** | Background lightens, delete icon fades in (right side) |
| **Conversation item click** | Active highlight, load conversation in main workspace |
| **Suggested card hover** | Border turns primary color, subtle shadow lift |
| **Suggested card click** | Card text populates input area, auto-sends after 300ms |
| **Input focus** | Border color transitions to primary, subtle glow |
| **Input expand** | Smooth height transition as content grows (200ms ease) |
| **Send button enable** | Color transitions from gray to primary (200ms) |
| **Message appear** | Fade-in + slide-up (300ms ease-out) |
| **Streaming tokens** | Characters appear one-by-one, cursor blinks at end |
| **Source strip appear** | Chips fade in left-to-right with 50ms stagger |
| **Source chip click** | Chip highlights, context panel scrolls to matching item |
| **Copy button click** | Icon swaps to checkmark for 2 seconds, tooltip "Copied!" |
| **Feedback buttons** | Filled icon on click, subtle bounce animation |
| **Context panel toggle** | Width transitions smoothly (300ms ease), content reflows |
| **Panel tab switch** | Underline slides to active tab (200ms), content crossfades |
| **Confidence bar** | Animates fill on appearance (500ms ease-out) |
| **Tool call indicator** | Spinner rotates continuously, transitions to checkmark |
| **Error state** | Message fades in with red-tinted background, auto-dismiss after 10s |

### 6.3 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |
| `Cmd/Ctrl + K` | Focus search in conversation sidebar |
| `Cmd/Ctrl + N` | New chat |
| `Cmd/Ctrl + Shift + ]` | Toggle context panel |
| `Cmd/Ctrl + Shift + [` | Toggle sidebar |
| `Escape` | Close context panel (if open) / blur input |

---

## 7. Color System & Dark Mode

### 7.1 Light Mode

```
BACKGROUND层级:
  bg-primary:        #FFFFFF  (page background)
  bg-surface-0:      #FFFFFF  (sidebar background)
  bg-surface-50:     #F9FAFB  (input background, subtle fills)
  bg-surface-100:    #F3F4F6  (hover states, code blocks)
  bg-surface-200:    #E5E7EB  (disabled states, borders)

TEXT层级:
  text-primary:      #111827  (headings, main text)
  text-secondary:    #4B5563  (body text, descriptions)
  text-tertiary:     #9CA3AF  (placeholders, timestamps)
  text-inverse:      #FFFFFF  (text on primary backgrounds)

ACCENT (Brand):
  primary-50:        #EEF2FF  (very light accent backgrounds)
  primary-100:       #E0E7FF
  primary-200:       #C7D2FE
  primary-300:       #A5B4FC
  primary-400:       #818CF8
  primary-500:       #6366F1  (main accent)
  primary-600:       #4F46E5  (buttons, active states)
  primary-700:       #4338CA  (hover states)
  primary-800:       #3730A3
  primary-900:       #312E81

BORDERS:
  border-default:    #E5E7EB
  border-subtle:     #F3F4F6
  border-focus:      #6366F1  (primary-500)

STATUS:
  success:           #10B981  (completed, high confidence)
  warning:           #F59E0B  (medium confidence)
  error:             #EF4444  (failed, low confidence)
  info:              #3B82F6  (informational)
```

### 7.2 Dark Mode

```
BACKGROUND层级:
  bg-primary:        #0F0F0F  (page background)
  bg-surface-0:      #141414  (sidebar background)
  bg-surface-50:     #1A1A1A  (input background)
  bg-surface-100:    #262626  (hover states)
  bg-surface-200:    #333333  (disabled states)
  bg-surface-800:    #1A1A1A  (code blocks)
  bg-surface-850:    #171717  (code content)
  bg-surface-900:    #111111  (deepest surface)

TEXT层级:
  text-primary:      #F3F4F6  (headings, main text)
  text-secondary:    #D1D5DB  (body text)
  text-tertiary:     #6B7280  (placeholders)
  text-inverse:      #111827  (text on light backgrounds)

ACCENT (Brand — same palette, perception shifts on dark):
  primary-500:       #818CF8  (slightly brighter for dark bg)
  primary-600:       #6366F1  (buttons, active)
  primary-700:       #4F46E5  (hover)

BORDERS:
  border-default:    #262626
  border-subtle:     #1F1F1F
  border-focus:      #818CF8

CODE BLOCKS:
  code-bg:           #1A1A1A
  code-header-bg:    #1F1F1F
  code-border:       #262626
```

### 7.3 Theme Toggle

```
Trigger:        System preference (prefers-color-scheme) by default
Override:       Manual toggle in user settings
Storage:        localStorage key "theme" → "light" | "dark" | "system"
Transition:     CSS transition on background-color, color (200ms ease)
```

---

## 8. Typography

### 8.1 Font Stack

```
UI Text:        "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Code:           "JetBrains Mono", "Fira Code", "Cascadia Code", monospace
```

### 8.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-h1` | 28px | 600 (semi-bold) | 36px | Welcome headline |
| `text-h2` | 20px | 600 | 28px | Section headings in responses |
| `text-h3` | 16px | 600 | 24px | Subsection headings |
| `text-body` | 15px | 400 (regular) | 24px (1.6) | Main chat text, responses |
| `text-body-sm` | 14px | 400 | 20px | Sidebar items, secondary text |
| `text-caption` | 13px | 500 (medium) | 18px | Tabs, labels, chips |
| `text-micro` | 12px | 500 | 16px | Code headers, timestamps |
| `text-code` | 13px | 400 | 20px | Code blocks |
| `text-input` | 15px | 400 | 24px | Chat input field |

---

## 9. Spacing & Grid

### 9.1 Spacing Scale (4px base)

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight gaps (icon to text) |
| `space-2` | 8px | Small gaps (within components) |
| `space-3` | 12px | Component internal padding |
| `space-4` | 16px | Standard padding, card gaps |
| `space-5` | 20px | Section spacing |
| `space-6` | 24px | Large section spacing |
| `space-8` | 32px | Page-level spacing |
| `space-10` | 40px | Major section separation |
| `space-12` | 48px | Welcome center area |

### 9.2 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Small elements (chips, badges) |
| `radius-md` | 8px | Medium elements (sidebar items, tool indicators) |
| `radius-lg` | 12px | Large elements (cards, input container) |
| `radius-xl` | 16px | Message bubbles |
| `radius-full` | 9999px | Circular (send button, avatars) |

### 9.3 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Cards, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Context panel, modals |
| `shadow-float` | `0 4px 24px rgba(0,0,0,0.15)` | Floating AI button |

---

## 10. Responsive Behavior

### 10.1 Breakpoints

```
Mobile:      < 768px     → Not primary target (read-only view)
Tablet:      768-1023px  → 1-column layout
Laptop:      1024-1279px → 2-column (collapsed sidebar + workspace)
Desktop:     ≥ 1280px    → Full 3-column layout
Wide:        ≥ 1536px    → Wider context panel (400px)
```

### 10.2 Layout Adaptations

```
≥ 1280px (Full):
┌────────┬──────────────────────────┬──────────┐
│ 260px  │        flex-1            │  340px   │
│ sidebar│        workspace         │  context │
└────────┴──────────────────────────┴──────────┘

1024-1279px (Collapsed sidebar):
┌────┬──────────────────────────────┬──────────┐
│64px│         flex-1               │  340px   │
│icons│        workspace            │  context │
└────┴──────────────────────────────┴──────────┘

768-1023px (Tablet):
┌──────────────────────────────────────┬────────┐
│              flex-1                  │ overlay│
│             workspace                │ context│
│              (no sidebar)            │ (slide)│
└──────────────────────────────────────┴────────┘

< 768px (Mobile):
┌──────────────────────────────────┐
│            Full width            │
│           workspace              │
│        (no sidebar, no context)  │
│       (context as bottom sheet)  │
└──────────────────────────────────┘
```

### 10.3 Context Panel Responsive Rules

| Breakpoint | Behavior |
|---|---|
| ≥ 1280px | Panel visible by default, collapsible |
| 1024-1279px | Panel visible, collapsible |
| 768-1023px | Panel hidden by default, slides in as overlay from right |
| < 768px | Panel as bottom sheet, swipe up to reveal |

---

## 11. States & Transitions

### 11.1 Loading States

```
SKELETON LOADER (during initial conversation load):
  ┌────────────────────────────────────────┐
  │  ┌──────┐                              │
  │  │ avatar│  ████████████░░░░░░░░       │
  │  └──────┘  █████████░░░░░░░░░░░       │
  │            ██████████████░░░░░░        │
  └────────────────────────────────────────┘
  Style:     Pulsing animation on gray bars
  Duration:  Shown until first token arrives (typically <500ms)

STREAMING INDICATOR:
  ▊ (blinking cursor at end of last token)
  Animation: 500ms blink cycle (opacity 1→0→1)

THINKING INDICATOR (before first token):
  "Thinking..."
  Animation: Three dots animate sequentially (ellipsis)
  Duration:  While waiting for retrieval + first LLM token
```

### 11.2 Error States

```
NETWORK ERROR:
  ┌─────────────────────────────────────────┐
  │  ⚠️ Connection lost.                    │
  │  Check your network and try again.      │
  │                          [Retry]         │
  └─────────────────────────────────────────┘
  Style:     Warning-tinted background, retry button

LLM ERROR:
  ┌─────────────────────────────────────────┐
  │  ⚠️ Something went wrong.               │
  │  The assistant encountered an error.     │
  │                     [Try Again] [New Chat]│
  └─────────────────────────────────────────┘
  Style:     Error-tinted background, two action buttons

NO RESULTS:
  ┌─────────────────────────────────────────┐
  │  I couldn't find relevant information   │
  │  in the knowledge base for this query.  │
  │                                         │
  │  Try:                                   │
  │  • Rephrasing your question             │
  │  • Asking about a specific project      │
  │  • Being more specific about what       │
  │    you're looking for                   │
  └─────────────────────────────────────────┘
  Style:     Muted background, helpful suggestions
```

---

## 12. Accessibility

### 12.1 Requirements

| Standard | Target |
|---|---|
| WCAG | 2.1 AA compliance |
| Keyboard | Full navigation without mouse |
| Screen reader | ARIA labels on all interactive elements |
| Color contrast | 4.5:1 minimum for text, 3:1 for large text |
| Focus indicators | Visible focus ring on all interactive elements |

### 12.2 Key ARIA Patterns

| Component | ARIA Role | Label |
|---|---|---|
| ConversationSidebar | `navigation` | "Conversation history" |
| NewChatButton | `button` | "Start new conversation" |
| ConversationItem | `button` + `aria-current` | "{conversation title}" |
| ChatInput | `textbox` | "Type your message" |
| SendButton | `button` | "Send message" |
| MessageList | `log` + `aria-live="polite"` | "Chat messages" |
| ContextPanel | `complementary` | "Source context" |
| SourceItem | `button` | "Open {file name}" |
| CopyButton | `button` | "Copy response" |
| ThumbsUp | `button` | "Mark response as helpful" |
| ThumbsDown | `button` | "Mark response as not helpful" |
| FloatingAIButton | `button` | "Open CorpusGuard AI Assistant" |

### 12.3 Focus Management

```
On page load (/ai-assistant):
  → Focus on ChatInput

On new conversation:
  → Focus on ChatInput

On send message:
  → Focus stays on ChatInput
  → New message added to log, screen reader announces

On conversation item click:
  → Load conversation, focus on ChatInput

On context panel toggle:
  → Focus moves to first tab in panel

On keyboard shortcut (Cmd+K):
  → Focus moves to sidebar search input
  → Escape returns focus to ChatInput
```

---

## 13. User Journey

### Journey 1: First-Time User

```
Step 1: User is on Dashboard page
        │
        ▼ Sees floating AI button (bottom-right, pulsing gently)
Step 2: Clicks floating button
        │
        ▼ Navigates to /ai-assistant
Step 3: Sees WelcomeState
        │  • Brand icon centered
        │  • "What can I help you with?"
        │  • 7 suggested question cards
        │
        ▼ Reads suggested questions
Step 4: Clicks "Explain Docker setup." card
        │
        ▼ Card text populates input, auto-sends
Step 5: Sees "Thinking..." indicator (200-400ms)
        │
        ▼ Tool indicators appear: "Searching codebase..."
Step 6: Response streams in token-by-token
        │  • Markdown renders in real-time
        │  • Code blocks appear with syntax highlighting
        │  • Citation badges [1] [2] appear inline
        │
        ▼ Source strip populates below response
Step 7: Response complete
        │  • Source chips visible: docker-compose.yml, Dockerfile, README.md
        │  • Context panel shows 5 sources with relevance scores
        │  • Feedback buttons appear
        │
        ▼ User clicks source chip "docker-compose.yml"
Step 8: Context panel scrolls to source, highlights it
        │  • User can click to open full file
        │
        ▼ User types follow-up
Step 9: "How many services are defined?"
        │
        ▼ Assistant answers with context from same conversation
```

### Journey 2: Senior Engineer — Cross-Repo Query

```
Step 1: Engineer navigates to /ai-assistant directly (bookmarked)
        │
        ▼ Sees conversation history in sidebar
Step 2: Clicks "New Chat"
        │
        ▼ WelcomeState appears
Step 3: Types: "Which project uses Redis?"
        │
        ▼ Sends (Enter)
Step 4: Tool calls fire:
        │  • Searching codebase... (searches across all repos)
        │  • Reading config files... (checks Docker, env files)
        │
        ▼ Response streams in
Step 5: "Two projects use Redis:
        │   1. **auth-service** — Redis for session caching
        │      (docker-compose.yml: redis:6379)
        │   2. **notification-worker** — Redis for message queue
        │      (config/cache.yml: redis_host: redis-cluster.internal)
        │
        │   [1] auth-service/docker-compose.yml
        │   [2] notification-worker/config/cache.yml
        │   [3] README.md (auth-service)"
        │
        ▼ Context panel shows 3 sources from 2 different repos
Step 6: Engineer clicks "Projects" tab in context panel
        │
        ▼ Sees both project cards with descriptions
```

### Journey 3: New Engineer — Onboarding

```
Step 1: New hire opens /ai-assistant on day 1
        │
        ▼ Sees suggested questions
Step 2: Clicks "How do I run this project?"
        │
        ▼ Gets step-by-step Docker setup instructions with code blocks
Step 3: Asks "What's the overall architecture?"
        │
        ▼ Gets architecture overview with references to README and docs
Step 4: Asks "Explain the authentication flow."
        │
        ▼ Gets detailed auth flow referencing actual code files
        │  • auth middleware path
        │  • JWT generation code
        │  • User model schema
Step 5: Asks "Show the PostgreSQL schema for users."
        │
        ▼ Context panel auto-switches to "Schema" tab
        │  • users table: id, email, name, role, created_at
        │  • Foreign keys shown
Step 6: After 15 minutes, new hire has understanding that
        │  previously took 2-3 days of asking senior engineers
        │
        ▼ Conversations saved in sidebar under "Today"
```

### Journey 4: DevOps — Config & Deployment Query

```
Step 1: DevOps navigates to /ai-assistant
        │
        ▼ Types: "What environment variables are needed for the backend?"
Step 2: Assistant retrieves .env.example + docker-compose.yml + config.py
        │
        ▼ Response:
        │  "The backend requires the following environment variables:
        │
        │   | Variable | Description | Default |
        │   |----------|-------------|---------|
        │   | DATABASE_URL | PostgreSQL connection string | — |
        │   | REDIS_URL | Redis connection string | redis://localhost:6379 |
        │   | JWT_SECRET | Secret for JWT signing | — |
        │   | OPENAI_API_KEY | OpenAI API key | — |
        │   | CORS_ORIGINS | Allowed origins | http://localhost:5173 |
        │
        │   [1] .env.example  [2] config.py  [3] docker-compose.yml"
        │
        ▼ Context panel shows API tab with relevant endpoints
Step 3: DevOps clicks "Schema" tab
        │
        ▼ Sees all database tables with column details
```

---

## 14. Folder Structure

```
frontend/src/
│
├── pages/
│   └── corpusguard/
│       │
│       ├── CorpusGuardPage.tsx           # Root page component (3-column layout)
│       │
│       ├── components/
│       │   │
│       │   ├── FloatingAIButton.tsx      # Global floating button (rendered in App.tsx)
│       │   │
│       │   ├── sidebar/
│       │   │   ├── ConversationSidebar.tsx   # Left panel container
│       │   │   ├── SidebarHeader.tsx         # Brand + New Chat button
│       │   │   ├── ConversationSearch.tsx    # Search input
│       │   │   ├── ConversationGroup.tsx     # Date-grouped conversation list
│       │   │   ├── ConversationItem.tsx      # Single conversation row
│       │   │   └── SidebarFooter.tsx         # User info + settings
│       │   │
│       │   ├── workspace/
│       │   │   ├── MainWorkspace.tsx         # Center column container
│       │   │   ├── WelcomeState.tsx          # Empty state with suggested questions
│       │   │   ├── SuggestedQuestions.tsx    # Grid of suggested question cards
│       │   │   ├── SuggestedCard.tsx         # Single suggestion card
│       │   │   ├── ChatState.tsx             # Active conversation container
│       │   │   ├── MessageList.tsx           # Scrollable message area
│       │   │   ├── UserMessage.tsx           # User message bubble
│       │   │   ├── AssistantMessage.tsx      # Assistant response container
│       │   │   ├── MessageContent.tsx        # Markdown rendered content
│       │   │   ├── StreamingCursor.tsx       # Blinking cursor during generation
│       │   │   ├── CitationBadge.tsx         # Inline citation [1] [2]
│       │   │   ├── SourceStrip.tsx           # Horizontal source chips below response
│       │   │   ├── SourceChip.tsx            # Individual source chip
│       │   │   ├── MessageActions.tsx        # Copy, thumbs up/down, regenerate
│       │   │   ├── ToolCallIndicator.tsx     # Tool call progress display
│       │   │   └── LoadingState.tsx          # Thinking / skeleton states
│       │   │
│       │   ├── input/
│       │   │   ├── InputArea.tsx             # Sticky bottom input container
│       │   │   ├── ChatInput.tsx             # Auto-resizing textarea
│       │   │   ├── SendButton.tsx            # Circular send button
│       │   │   ├── FileMentionButton.tsx     # File/repo mention trigger
│       │   │   └── InputHints.tsx            # Keyboard shortcuts + context scope
│       │   │
│       │   └── panel/
│       │       ├── ContextPanel.tsx          # Right panel container
│       │       ├── PanelHeader.tsx           # Title + collapse button
│       │       ├── PanelTabs.tsx             # Tab bar (Sources, Projects, API, Schema, Docs)
│       │       ├── SourcesPanel.tsx          # Sources tab content
│       │       ├── SourceGroup.tsx           # Grouped source items (by type)
│       │       ├── SourceItem.tsx            # Single source with relevance bar
│       │       ├── ProjectsPanel.tsx         # Projects tab content
│       │       ├── ProjectCard.tsx           # Single project card
│       │       ├── APIPanel.tsx              # API tab content
│       │       ├── EndpointItem.tsx          # Single API endpoint
│       │       ├── SchemaPanel.tsx           # Schema tab content
│       │       ├── TableCard.tsx             # Database table card
│       │       ├── DocsPanel.tsx             # Docs tab content
│       │       ├── DocumentItem.tsx          # Single document item
│       │       ├── ConfidenceBar.tsx         # Confidence score indicator
│       │       └── EmptyPanelState.tsx       # Empty state for all tabs
│       │
│       ├── hooks/
│       │   ├── useChat.ts                   # Chat state, send message, streaming
│       │   ├── useConversations.ts          # CRUD for conversation sessions
│       │   ├── useStreaming.ts              # SSE connection, token parsing
│       │   ├── useContextPanel.ts           # Panel state, tab management
│       │   ├── useSources.ts               # Source retrieval and display
│       │   └── useKeyboardShortcuts.ts     # Global keyboard shortcut handler
│       │
│       └── utils/
│           ├── markdown.ts                 # Markdown rendering config
│           ├── codeHighlight.ts            # Syntax highlighting setup
│           ├── mentionParser.ts            # Parse @file mentions from input
│           └── sseParser.ts               # Parse SSE stream into tokens
│
├── stores/
│   └── chatStore.ts                        # Zustand store for chat state
│
├── services/
│   └── corpusguardApi.ts                   # API client for CorpusGuard endpoints
│
└── lib/
    └── sse.ts                              # SSE client utility
```

---

## Appendix A: Suggested Questions Data

```json
{
  "suggestedQuestions": [
    {
      "id": "sq-1",
      "icon": "code",
      "category": "Architecture",
      "text": "Explain our backend architecture.",
      "tooltip": "Get an overview of the backend system design"
    },
    {
      "id": "sq-2",
      "icon": "play",
      "category": "Setup",
      "text": "How do I run this project?",
      "tooltip": "Get local development setup instructions"
    },
    {
      "id": "sq-3",
      "icon": "database",
      "category": "Dependencies",
      "text": "Which project uses Redis?",
      "tooltip": "Find which services depend on Redis"
    },
    {
      "id": "sq-4",
      "icon": "docker",
      "category": "Infrastructure",
      "text": "Explain Docker setup.",
      "tooltip": "Understand container configuration"
    },
    {
      "id": "sq-5",
      "icon": "api",
      "category": "API",
      "text": "Show login API.",
      "tooltip": "View the authentication API endpoint"
    },
    {
      "id": "sq-6",
      "icon": "schema",
      "category": "Database",
      "text": "Show PostgreSQL schema.",
      "tooltip": "View database table definitions"
    },
    {
      "id": "sq-7",
      "icon": "auth",
      "category": "Security",
      "text": "Explain authentication flow.",
      "tooltip": "Understand how auth works end-to-end"
    }
  ]
}
```

## Appendix B: Animation Timing Tokens

```json
{
  "duration-fast":      "100ms",
  "duration-normal":    "200ms",
  "duration-slow":      "300ms",
  "duration-slower":    "500ms",
  "easing-default":     "cubic-bezier(0.4, 0, 0.2, 1)",
  "easing-in":          "cubic-bezier(0.4, 0, 1, 1)",
  "easing-out":         "cubic-bezier(0, 0, 0.2, 1)",
  "easing-bounce":      "cubic-bezier(0.68, -0.55, 0.27, 1.55)"
}
```

## Appendix C: Z-Index Scale

```
z-base:         0
z-sidebar:      10
z-input:        20
z-panel:        30
z-dropdown:     40
z-overlay:      50
z-modal:        60
z-toast:        70
z-floating-btn: 9999
```
