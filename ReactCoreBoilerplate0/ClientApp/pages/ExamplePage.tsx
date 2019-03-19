import "@Styles/main.scss";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IPersonModel } from "@Models/IPersonModel";
import { ApplicationState } from "../store";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { PagingBar } from "@Components/shared/PagingBar";
import PersonEditor from "../person/components/PersonEditor";
import Loader from "@Components/shared/Loader";
import bind from 'bind-decorator';
import { ModalComponent } from "@Components/shared/ModalComponent";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { exportStore } from "../boot-client";
import * as apiClient from "../helpers/apiHelpers"

import registerReducer from "../login/reducer";


registerReducer();

import {
    personAddRequest,
    personAddResponse,
    personDeleteRequest,
    personDeleteResponse,
    personSearchRequest,
    personSearchResponse,
    personUpdateRequest,
    personUpdateResponse,
    personFailureResponse
} from "../person/actionCreators";   

const mapDispatchToProps = {
    personAddRequest,
    personAddResponse,
    personDeleteRequest,
    personDeleteResponse,
    personSearchRequest,
    personSearchResponse,
    personUpdateRequest,
    personUpdateResponse,
    personFailureResponse
}


type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{}>;

interface IState {
    searchTerm: string;
    pageNum: number;
    limitPerPage: number;
    rowOffset: number;
    modelForEdit: IPersonModel;
    modelForDelete: IPersonModel;
}


class ExamplePage extends React.Component<Props, IState> {

    private pagingBar: PagingBar;

    private elModalAdd: ModalComponent;
    private elModalEdit: ModalComponent;
    private elModalDelete: ModalComponent;

    private personEditorAdd: PersonEditor;
    private personEditorEdit: PersonEditor;

    private debouncedSearch: (term: string) => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            searchTerm: "",
            pageNum: 1,
            limitPerPage: 5,
            rowOffset: 0,
            modelForEdit: {},
            modelForDelete: {}
        };
        this.debouncedSearch = AwesomeDebouncePromise((term: string) => {
            this.doSearch(term);
        }, 500);
    }

    componentWillMount() {
        this.doSearch();
    }

    componentWillUnmount() {
        if (this.elModalAdd) {
            this.elModalAdd.hide();
        }
        if (this.elModalEdit) {
            this.elModalEdit.hide();
        }
        if (this.elModalDelete) {
            this.elModalDelete.hide();
        }
    }

    @bind
    private async doSearch(term: string = "") {
        this.props.personSearchRequest({ term: term });
        const result = await apiClient.getHelper(`/api/Person/Search?term=${term}`);

        if (!result.hasErrors) {
            this.props.personSearchResponse(result.value)
        } else {
            this.props.personFailureResponse({ errors: result.errors });
        }
    }


    @bind
    onChangePage(pageNum: number): void {
        let rowOffset = Math.ceil((pageNum - 1) * this.state.limitPerPage);
        this.setState({ pageNum, rowOffset });
    }

    @bind
    onClickShowAddModal(e: React.MouseEvent<HTMLButtonElement>) {
        this.elModalAdd.show();
    }

    @bind
    onClickShowEditModal(e: React.MouseEvent<HTMLButtonElement>, modelForEdit: IPersonModel) {
        this.setState({ modelForEdit });
        this.elModalEdit.show();
    }

    @bind
    onClickShowDeleteModal(e: React.MouseEvent<HTMLButtonElement>, modelForDelete: IPersonModel) {
        this.setState({ modelForDelete });
        this.elModalDelete.show();
    }

    @bind
    async onClickPersonEditorAdd__saveBtn(e: React.MouseEvent<HTMLButtonElement>) {
        if (!this.personEditorAdd.elForm.isValid()) {
            // Form is not valid.
            return;
        }

        const data = this.personEditorAdd.elForm.getData() as IPersonModel;
        var result = await apiClient.postHelper("/api/Person/Add",data);

        if (!result.hasErrors) {
            data.id = result.value;
            this.props.personAddResponse(data);
            this.pagingBar.setLastPage();
            this.elModalAdd.hide();
        } else {
            this.props.personFailureResponse({ errors: result.errors });
        }
    }

    @bind
    async onClickPersonEditorEdit__saveBtn(e: React.MouseEvent<HTMLButtonElement>) {
        if (!this.personEditorEdit.elForm.isValid()) {
            // Form is not valid.
            return;
        }

        const data = this.personEditorEdit.elForm.getData() as IPersonModel;
        var result = await apiClient.patchHelper(`/api/Person/${data.id}`, data);

        if (!result.hasErrors) {
            this.props.personUpdateResponse(data);
            this.elModalEdit.hide();
        } else {
            this.props.personFailureResponse({ errors: result.errors });
        }
    }

    @bind
    async onClickPersonEditorDelete__saveBtn(e: React.MouseEvent<HTMLButtonElement>) {

        const id = this.state.modelForDelete.id;
        this.props.personDeleteRequest({ id: id });
        var result = await apiClient.deleteHelper(`/api/Person/${id}`);
        if (!result.hasErrors) {
            this.props.personDeleteResponse({ id: id });
        } else {
            this.props.personFailureResponse({ errors: result.errors });
        }

        this.elModalDelete.hide();
    }

    @bind
    renderRow(person: IPersonModel) {
        return <tr key={person.id}>
            <td>{person.firstName}</td>
            <td>{person.lastName}</td>
            <td>
                <button className="btn btn-info" onClick={x => this.onClickShowEditModal(x, person)}>Edit</button>&nbsp;
                <button className="btn btn-danger" onClick={x => this.onClickShowDeleteModal(x, person)}>Delete</button>
            </td>
        </tr>;
    }

    @bind
    renderRows(data: IPersonModel[]) {
        return data
            .slice(this.state.rowOffset, this.state.rowOffset + this.state.limitPerPage)
            .map(x => this.renderRow(x));
    }

    @bind
    onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        var val = e.currentTarget.value;
        this.debouncedSearch(val);
        this.pagingBar.setFirstPage();
    }

    render() {
        console.log("getState(): ", exportStore().getState())
        return <div>
            <Helmet>
                <title>Example - RCB</title>
            </Helmet>
            <Loader show={this.props.person.indicators.operationLoading} />

            <div className="panel panel-default">
                <div className="panel-body row">
                    <div className="col-sm-1">
                        <button className="btn btn-success" onClick={this.onClickShowAddModal}>Add</button>
                    </div>
                    <div className="col-sm-11">
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={""}
                            onChange={this.onChangeSearchInput}
                            placeholder={"Search for people..."}
                        />
                    </div>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>First name</th><th>Last name</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows(this.props.person.people)}
                </tbody>
            </table>

            {/* Add modal */}
            <ModalComponent
                ref={x => this.elModalAdd = x}
                buttons={<div>
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.onClickPersonEditorAdd__saveBtn}>Save</button>
                </div>}
                title="Add person"
                onHide={() => {
                    if (this.personEditorAdd) {
                        this.personEditorAdd.emptyForm();
                    }
                }}>
                <PersonEditor ref={x => this.personEditorAdd = x} data={{}} />
            </ModalComponent>

            {/* Edit modal */}
            <ModalComponent
                ref={x => this.elModalEdit = x}
                buttons={<div>
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.onClickPersonEditorEdit__saveBtn}>Save</button>
                </div>}
                title={`Edit person: ${this.state.modelForEdit.firstName} ${this.state.modelForEdit.lastName}`}
                onHide={() => {
                    if (this.personEditorEdit) {
                        this.setState({ modelForEdit: {} });
                    }
                }}>
                <PersonEditor ref={x => this.personEditorEdit = x} data={this.state.modelForEdit} />
            </ModalComponent>

            {/* Delete modal */}
            <ModalComponent
                ref={x => this.elModalDelete = x}
                buttons={<div>
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-danger" onClick={this.onClickPersonEditorDelete__saveBtn}>Delete</button>
                </div>}
                title={`Delete person: ${this.state.modelForDelete.firstName} ${this.state.modelForDelete.lastName}`}>
                <p>Do you really want to delete this person?</p>
            </ModalComponent>

            <PagingBar
                ref={x => this.pagingBar = x}
                totalResults={this.props.person.people.length}
                limitPerPage={this.state.limitPerPage}
                currentPage={this.state.pageNum}
                onChangePage={this.onChangePage}
            />
        </div>;
    }
}

const mapStateToProps = ({ person }: ApplicationState) => ({ person});

export default connect(mapStateToProps, mapDispatchToProps)(ExamplePage);