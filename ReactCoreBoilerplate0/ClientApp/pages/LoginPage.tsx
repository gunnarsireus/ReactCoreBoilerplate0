import { ILoginModel } from "@Models/ILoginModel";
import Loader from "@Components/shared/Loader";
import { loginInit, loginRequest, loginResponse, loginSuccess, loginFailure } from "../login/actionCreators";
import AccountService from "@Services/AccountService";
import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps} from "react-router";
import bind from 'bind-decorator';
import { Form } from "@Components/shared/Form";
import registerReducer from "../login/reducer";

registerReducer();

const mapDispatchToProps = {
    loginInit,
    loginRequest,
    loginResponse,
    loginSuccess,
    loginFailure
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{}>;

class LoginPage extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    elLoader: Loader;
    elForm: Form;

    componentDidMount() {
        
        this.props.loginInit();
        
        if (this.elLoader) {
            this.elLoader.forceUpdate();
        }
    }

    @bind
    private async onClickSubmitBtn(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (this.elForm.isValid()) {
            var data = this.elForm.getData<ILoginModel>();
            this.props.loginRequest(data);
            var result = await AccountService.login(data);
            if (result.hasErrors) {
                this.props.loginFailure();
                return;
            }
            this.props.loginSuccess(result.value);
        }
    }

    render() {

        if (this.props.login.indicators.loginSuccess) {
            return <Redirect to="/"/>;
        }

        return <div id="loginPage">

            <Helmet>
                <title>Login page - RCB</title>
            </Helmet>
            
            <Loader ref={x => this.elLoader = x} show={this.props.login.indicators.operationLoading} />

            <div id="loginContainer">

                <p className="text-center">Type any login and password to enter.</p>

                <Form ref={x => this.elForm = x}>
                    <div className="form-group">
                        <label htmlFor="inputLogin">Login</label>
                        <input type="text" name={nameof<ILoginModel>(x=>x.login)} data-value-type="string" className="form-control" id="inputLogin" data-val-required="true" data-msg-required="Login is required." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLogin">Password</label>
                        <input type="password" name={nameof<ILoginModel>(x=>x.password)} data-value-type="string" className="form-control" id="inputPassword" data-val-required="true" data-msg-required="Password is required." />
                    </div>
                    <div className="form-inline">
                        <button className="btn btn-success" onClick={this.onClickSubmitBtn}>Sign in</button>
                    </div>
                </Form>
            </div>

        </div>;
    }
}

const mapStateToProps = ({ login }: ApplicationState) => ({ login });

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);