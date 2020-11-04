import React, { Component } from 'react'
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import TodoDataService from '../../api/todo/TodoDataService.js'
import AuthenticationService from './AuthenticationService.js'

class TodoComponent2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            file: '',
            id: this.props.match.params.id,
            description: '',
            region: '',
            targetDate: moment(new Date()).format('YYYY-MM-DD')
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.onFileInputChange = this.onFileInputChange.bind(this)
        this.onSendFileClick = this.onSendFileClick.bind(this)

    }

    onFileInputChange(e){
        console.log(e.target.value);
        this.setState({file: e.target.value});
    }

    onSendFileClick(e){
        console.log(this.state.file);
        TodoDataService.sendFileName(this.state.file, this.state.id);
    }

    componentDidMount() {

        if (this.state.id === -1) {
            return
        }

        let username = AuthenticationService.getLoggedInUserName()

        TodoDataService.retrieveTodo2(username, this.state.id)
            .then(response => this.setState({
                description: response.data.description,
                region: response.data.region,
                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD')
            }))
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = 'Enter a Description'
        } else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }

        if (!values.region) {
            errors.region = 'Enter a region'
        } else if (values.region.length < 3) {
            errors.region = 'Enter atleast 3 Characters in region'
        }

        if (!moment(values.targetDate).isValid()) {
            errors.targetDate = 'Enter a valid Target Date'
        }

        return errors

    }

    onSubmit(values) {
        this.props.history.push('/todos');
    }

    render() {

        let { description, region, targetDate, file } = this.state
        //let targetDate = this.state.targetDate

        return (
            <div>
                <h1>apartment</h1>
                <div className="container">
                    <Formik
                        initialValues={{ description, region, targetDate, file }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="description" component="div"
                                        className="alert alert-warning" />
                                    <ErrorMessage name="region" component="div"
                                                  className="alert alert-warning" />
                                    <ErrorMessage name="targetDate" component="div"
                                        className="alert alert-warning" />
                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Region</label>
                                        <Field className="form-control" type="text" name="region" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Target Date</label>
                                        <Field className="form-control" type="date" name="targetDate" />
                                    </fieldset>


                                    <button className="btn btn-success" type="submit">Back</button>
                                    <fieldset className="form-group">
                                        <label style={{marginRight: "900px"}}>Name of the file</label>
                                        <input style={{width: "200px"}} className="form-control" type="text" onChange={(e) => this.onFileInputChange(e)}  />
                                    </fieldset>
                                    <button  style={{marginRight: "920px"}} className="btn btn-success" onClick={this.onSendFileClick}>Save</button>
                                </Form>
                            )
                        }
                    </Formik>

                </div>
            </div>
        )
    }
}

export default TodoComponent2
