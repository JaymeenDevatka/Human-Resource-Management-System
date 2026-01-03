import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/global.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);