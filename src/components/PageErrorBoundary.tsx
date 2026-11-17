import { Component, type ReactNode } from "react";

interface PageErrorBoundaryProps {
    pathname: string;
    children: ReactNode;
}

interface PageErrorBoundaryState {
    pathname: string;
    hasError: boolean;
    hasRetried: boolean;
}

class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
    state: PageErrorBoundaryState = {
        pathname: this.props.pathname,
        hasError: false,
        hasRetried: false,
    };

    static getDerivedStateFromProps(
        props: PageErrorBoundaryProps,
        state: PageErrorBoundaryState,
    ): Partial<PageErrorBoundaryState> | null {
        if (props.pathname !== state.pathname) {
            return { pathname: props.pathname, hasError: false, hasRetried: false };
        }
        return null;
    }

    static getDerivedStateFromError(): Partial<PageErrorBoundaryState> {
        return { hasError: true };
    }

    componentDidCatch() {
        if (!this.state.hasRetried) {
            console.error("No se pudo mostrar la página; se reintentará una vez.");
            this.setState({ hasError: false, hasRetried: true });
        } else {
            console.error("No se pudo mostrar la página después del reintento.");
        }
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <main
                className="flex min-h-screen flex-col items-center justify-center bg-[rgba(255,254,253,1)] p-8 text-center text-[#414141]"
                style={{ fontFamily: "'Castoro', serif" }}
            >
                {this.state.hasRetried ? (
                    <div role="alert">
                        <h1 className="text-2xl font-normal">No se pudo mostrar la página</h1>
                        <p className="mt-2">Se ha producido un error incluso después de volver a intentarlo.</p>
                        <a href="/" className="mt-6 inline-block underline">Volver al inicio</a>
                    </div>
                ) : (
                    <p role="status">Reintentando mostrar la página…</p>
                )}
            </main>
        );
    }
}

export default PageErrorBoundary;
