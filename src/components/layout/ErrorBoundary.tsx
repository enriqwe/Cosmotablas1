import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-space-dark flex flex-col items-center justify-center p-6 text-white">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Algo salió mal
          </h1>
          <p className="text-white/70 mb-8 text-center max-w-sm">
            Ha ocurrido un error inesperado. Por favor, recarga la página para continuar tu aventura espacial.
          </p>
          <button
            onClick={this.handleReload}
            className="px-8 py-3 bg-space-blue text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
