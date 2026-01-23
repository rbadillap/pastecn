# Changelog

All notable changes to pastecn will be documented in this file.

---

## Password Protection - Technical Documentation

**Target Audience:** Developers, security engineers, technical reviewers

### Overview

Implementation of optional password protection for code snippets with native shadcn CLI authentication support and enterprise-grade security.

### Technical Specifications

**Authentication Architecture:**
- Password-based access control using bcrypt hashing (cost factor 10)
- Bearer token authentication for CLI access (RFC 6750 compliant)
- Session-based web authentication with httpOnly cookies
- Configurable session duration via environment variables (default: 24 hours)
- Rate limiting via Vercel Firewall SDK (5 attempts/15 minutes per IP)

**Data Model:**
- Passwords stored in `meta.passwordHash` field per shadcn registry-item.json schema
- 16-character auto-generated passwords using nanoid with custom alphabet
- Entropy: ~95 bits (52^16 possible combinations)
- Hash never exposed via API responses or client-side code

**API Changes:**
- `POST /api/snippets/upload` - Extended to accept optional password parameter
- `POST /api/snippets/[id]/unlock` - New endpoint for web authentication with rate limiting
- `GET /r/[id]` - Modified to enforce Bearer token authentication for protected snippets

**Security Measures:**
- Vercel Rate Limiting SDK integration for brute-force prevention
- Optional Vercel Bot Protection for automated traffic challenges
- Timing-safe password comparison (bcrypt native)
- No password information in URLs or logs
- Private cache control headers for protected content

**CLI Integration:**
- Compatible with shadcn CLI registry authentication specification
- Environment variable based configuration (`.env.local`)
- Standard Authorization header: `Bearer ${PASTE_PASSWORD}`
- Helpful 401 responses with setup instructions

**Backward Compatibility:**
- Existing unprotected snippets continue to function identically
- No breaking changes to public API surface
- Optional feature - disabled by default

### Implementation Details

**Modified Files:**
- `/app/api/snippets/upload/route.ts` - Password hashing on upload
- `/app/r/[id]/route.ts` - Bearer token validation
- `/app/p/[id]/page.tsx` - Protected access detection
- `/lib/snippets.tsx` - Protected flag exposure (hash hidden)
- `/components/registry-pastebin.tsx` - Password UI integration

**New Files:**
- `/lib/password.ts` - Cryptographic utilities
- `/app/api/snippets/[id]/unlock/route.ts` - Web authentication endpoint
- `/components/unlock-dialog.tsx` - Password entry modal

**Dependencies Added:**
- `bcryptjs@^3.0.3` - Password hashing
- `@vercel/firewall@^1.1.2` - Rate limiting integration
- `jsonwebtoken@^9.0.3` - Session token management

**Environment Variables:**
- `UNLOCK_SESSION_SECRET` - JWT secret for signing unlock sessions (required in production)
- `UNLOCK_SESSION_DURATION_HOURS` - Session duration in hours (default: 24)

### Security Audit Notes

**Threat Model Coverage:**
- Brute force attacks: Mitigated via rate limiting (5 attempts/15 min)
- Timing attacks: Mitigated via bcrypt constant-time comparison
- Credential exposure: Mitigated via bcrypt hashing and secure session management
- Automated abuse: Mitigated via optional Vercel Bot Protection
- Session hijacking: Mitigated via httpOnly cookies and session expiration

**Known Limitations:**
- Password strength entirely depends on auto-generated value (user cannot set custom password)
- No password rotation mechanism
- No account recovery flow (password lost = snippet inaccessible)
- Rate limiting state managed by Vercel Firewall (subject to Vercel infrastructure)

**Compliance Considerations:**
- Passwords hashed using industry-standard bcrypt
- No plaintext passwords stored or logged
- HTTPS enforced (Vercel default)
- Follows OWASP password storage guidelines

---

## Password Protection - Public Release Notes

**Target Audience:** General users, content creators, snippet sharers

### What's New

**Protected Snippets**

You can now add password protection to your code snippets. When enabled, viewers must enter a password before accessing the content. This works for both web browsers and command-line tools.

### How It Works

**Creating Protected Snippets:**
1. Toggle "Password Protection" when creating your snippet
2. A secure password is automatically generated for you
3. Copy the password - you'll need it to share with others
4. Create your snippet as usual
5. After creation, you can immediately see and share the snippet URL and CLI command

**Accessing Protected Snippets:**
- Web: Enter the password directly in the locked code container (inline unlock)
- CLI: Configure the password in your project settings

### Key Features

**Auto-Generated Passwords:**
Secure 16-character passwords are created automatically. No need to think of one yourself. Regenerate if you want a different password.

**Copy and Share:**
Password is displayed once during creation. Copy it and share it securely with your intended audience.

**CLI Compatible:**
Works seamlessly with shadcn CLI. Configure once in your environment variables and install components normally.

**Selective Protection:**
Password protection is optional. Your existing snippets remain public, and you can choose when to use protection for sensitive code.

### Use Cases

**Internal Team Sharing:**
Share snippets within your organization without making them publicly discoverable.

**Client Deliverables:**
Provide code to clients with controlled access.

**Preview Releases:**
Share pre-release components with selected testers before public announcement.

**Sensitive Examples:**
Protect snippets containing configuration examples or internal patterns.

### Security Note

Passwords are hashed and never stored in plain text. Rate limiting prevents unauthorized access attempts. Sessions expire when you close your browser tab.

### Getting Started

Create a new snippet and toggle "Password Protection" to try it out. The password will be shown immediately after creation.

For CLI setup instructions, see the documentation at your snippet's page.
