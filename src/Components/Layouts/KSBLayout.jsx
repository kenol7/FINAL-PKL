import LoginLayout from "./LoginLayout"; 

const KSBLayout = (props) => {
    const { title, children } = props;
    return (
        <LoginLayout height="533px">
            {title}
            {children}
        </LoginLayout>
    );
}

export default KSBLayout;