import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
    return(
        <div>
            <p>Landing Page</p>
            <div>
                <Link href="/sign-in">
                    <Button>Signin</Button>
                </Link>
                <Link href="/sign-up">
                    <Button>Signup</Button>
                </Link>
            </div>
        </div>
    )
}

export default LandingPage;