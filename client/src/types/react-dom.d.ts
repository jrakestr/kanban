declare module 'react-dom/client' {
    import { Container } from 'react-dom';
    import { Root } from 'react-dom/client';

    export function createRoot(container: Container | null): Root;
}
