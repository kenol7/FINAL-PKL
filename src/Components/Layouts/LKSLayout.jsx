import LoginLayout from "./LoginLayout"; 

const LKSLayout = (props) => {
    const { title, children } = props;
    return (
        <LoginLayout height="458px">
            {title}
            {children}
        </LoginLayout>
    );
}

export default LKSLayout;