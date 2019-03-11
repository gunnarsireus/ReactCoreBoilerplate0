export enum LoginActions {
    /**
     * You need to have the initial state to
     * reset the indicators (e.g. loginSuccess)
     * that call redirect or any other actions.
     * It must be called in method 'componentDidMount'
     * of a component.
     */
    Init = "LOGIN_INIT",
    Request = "LOGIN_REQUEST",
    Response = "LOGIN_RESPONSE",
    Success = "LOGIN_SUCCESS",
    Failure = "LOGIN_FAILURE",
}

export default LoginActions;