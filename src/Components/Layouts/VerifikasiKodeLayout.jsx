import LoginLayout from "./LoginLayout"; 

const VerifLayout = (props) => {
    const { title, children } = props;
    return (
        <LoginLayout height="458px">
            {title}
            {children}
        </LoginLayout>
    );
}

export default VerifLayout;