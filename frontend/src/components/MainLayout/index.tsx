import Head from "next/head";
import { ReactNode } from "react";
import Header from "@/components/Header";
// import Footer from "@/components/Footer";


interface Props{
    children?: ReactNode;
    name?: string;
}
export function MainLayout(props: Props){
    return <div>
        <Head>
            <title>{props.name}</title>
        </Head>
        <Header />
        <main>{props.children}</main>
        {/* <Footer /> */}
    </div>;
}

export default MainLayout;
