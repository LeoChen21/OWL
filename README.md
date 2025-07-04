# OWL - Online Web Library

## 🌐 **Live Demo: [https://main.d2x1y6x1u800j9.amplifyapp.com/](https://main.d2x1y6x1u800j9.amplifyapp.com/)**

A modern, user-friendly web application for managing and organizing online resources. Built with React, TypeScript, and AWS Amplify Gen2.

## ✨ Features

- 📝 **Create, Read, Update, Delete** entries with name, type, URL, and creator
- 🎯 **Content Types**: Written, Illustrated, and Video resources
- 🔍 **Sortable Columns**: Click any column header to sort entries
- ✏️ **Inline Editing**: Edit entries directly in the table
- 🔐 **User Authentication**: Secure login with AWS Cognito
- 🔄 **Real-time Updates**: Live synchronization across all connected clients
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── TodoForm.tsx    # Entry creation form
│   └── TodoTable.tsx   # Data table with editing
├── hooks/              # Custom React hooks
│   ├── useTodos.ts     # Todo data management
│   └── useEditTodo.ts  # Inline editing logic
├── styles/             # Component-specific CSS
│   ├── App.css
│   ├── TodoForm.css
│   └── TodoTable.css
└── App.tsx             # Main application component
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- AWS Account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OWL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development environment**
   ```bash
   # Start AWS Amplify sandbox (backend)
   npx ampx sandbox
   
   # In a new terminal, start the frontend
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

> **Development Environment**: Uses AWS Amplify Gen2 Sandbox for isolated backend resources during development

### First Time Setup

1. **Create an account** when prompted
2. **Verify your email** (check spam folder)
3. **Sign in** and start adding entries!

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: AWS Amplify Gen2, GraphQL
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **Real-time**: AWS AppSync subscriptions
- **Hosting**: AWS Amplify Hosting

## 📋 Usage

### Adding Entries
1. Click "**+ Add New Entry**"
2. Fill in the form:
   - **Name**: Title of the resource
   - **Type**: Written, Illustrated, or Video
   - **URL**: Link to the resource
   - **Creator**: Author or creator name
3. Click "**Add Entry**"

### Editing Entries
1. Click "**Edit**" on any row
2. Modify fields inline
3. Click "**Save**" or "**Cancel**"

### Sorting
- Click any column header to sort
- Click again to reverse sort order
- Sort indicators: ↑ (ascending), ↓ (descending), ↕️ (sortable)

### Deleting Entries
- Click "**Delete**" on any row
- Entry is immediately removed

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start frontend development server
npx ampx sandbox     # Start backend sandbox environment

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting & Type Checking
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
```

## 🌍 Deployment

### Production Deployment

1. **Push to Git repository** (GitHub, GitLab, or Bitbucket)

2. **Connect to AWS Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Configure build settings (uses `amplify.yml`)

3. **Automatic deployment**:
   - Every push to main branch triggers deployment
   - Backend and frontend deploy automatically
   - Get a live URL like `https://main.d1234567890.amplifyapp.com`

### Manual Deployment
```bash
# Deploy backend only
npx ampx pipeline-deploy --branch main

# Build frontend
npm run build
# Upload dist/ folder to your preferred hosting service
```

## 🔐 Security Features

- **Authentication**: Required for all operations
- **Authorization**: Users only see their own entries
- **Data Isolation**: Owner-based access control
- **HTTPS**: All data transmitted securely
- **Input Validation**: Form validation on frontend and backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add documentation for new features
5. Test your changes: `npm run dev`
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📝 Development Workflow

### Adding New Features

1. **Create new components** in `src/components/`
2. **Add custom hooks** in `src/hooks/` for logic
3. **Style components** with CSS in `src/styles/`
4. **Update schema** in `amplify/data/resource.ts` if needed
5. **Test locally** with `npx ampx sandbox`

### Code Style

- Use **TypeScript** for type safety
- Follow **React functional components** pattern
- Use **custom hooks** for business logic
- Keep **components focused** and reusable
- Add **CSS classes** instead of inline styles

## 🐛 Troubleshooting

### Common Issues

**Authentication errors:**
```bash
# Clear local auth cache
rm -rf ~/.aws/sso/cache/
npx ampx sandbox --profile default
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database schema changes:**
```bash
# Redeploy sandbox after schema changes
npx ampx sandbox --once
```

### Getting Help

- Check the [AWS Amplify Documentation](https://docs.amplify.aws/)
- Review [React Documentation](https://react.dev/)
- Search [GitHub Issues](../../issues)
- Contact the development team

## 📊 Performance

- **Initial Load**: ~2-3 seconds
- **Real-time Updates**: Instant via WebSocket
- **Data Sync**: Automatic background sync
- **Caching**: Built-in browser and CDN caching

## 🔄 Roadmap

- [ ] Export data to CSV/JSON
- [ ] Bulk operations (delete multiple)
- [ ] Search and filtering
- [ ] Categories and tags
- [ ] Sharing entries with other users
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS Amplify team for the excellent development platform
- React team for the powerful frontend framework
- Open source community for inspiration and tools

---

**Made with ❤️ by the OWL Development Team**