import Header from '../components/header';

export default function PageTemplate({children}) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}