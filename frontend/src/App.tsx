import Layout from "@/components/layout";
import { StoreLoader } from "@/components/store-loader";

function App() {
    return (
        <StoreLoader>
            <Layout />
        </StoreLoader>
    );
}

export default App;
