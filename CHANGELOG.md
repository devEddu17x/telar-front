# Changelog

All notable changes to the Telar frontend are documented in this file.

## [0.1.0] - Initial Release

First usable version of the Telar administrative frontend for garment
manufacturing businesses.

### Added

- Main application navigation for administrators and sellers.
- Initial dashboard with a clothes catalog preview.
- Employee management, including account status controls.
- Customer management and customer search.
- Clothes catalog management with variants and image uploads through presigned
  URLs.
- Quotations workflow with garment variants and customizations.
- Production orders generated from approved quotations.
- Profile management for the signed-in user.

### Authentication And Integration

- Direct Cognito authentication for sign-in, password changes, and session
  refresh.
- Tenant registration through the backend registration endpoint.
- Direct browser API integration for business operations, with Cognito IdToken
  authentication.
- Image upload support using the backend presigned URL flow.

### Deployment

- Static Next.js export configured for deployment without application compute.
- Output can be served from S3 and CloudFront, or tested through Vercel and
  Amplify.
