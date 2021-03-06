import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { approvalLimitsActions, employeesActions } from '../actions';
import ApprovalLimit from '../components/ApprovalLimit';
import ApprovalLimitsList from './ApprovalLimitsList';
import NewApprovalLimitModal from './NewApprovalLimitModal';
import { Field, reduxForm } from 'redux-form';
import { modal } from 'react-redux-modal';
import { toastr } from 'react-redux-toastr';
import { toastrHelpers } from '../helpers';

class ApprovalLimitsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleParamChangeText = this.handleParamChangeText.bind(this);
    this.handleAddLimit = this.handleAddLimit.bind(this);
    this.showNewApprovalLimitModal = this.showNewApprovalLimitModal.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(employeesActions.requestAll())
    this.props.dispatch(approvalLimitsActions.findAllCostCentres())
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.params !== nextprops.params) {
      this.props.dispatch(approvalLimitsActions.requestWith(nextprops.params))
    }
  }

  handleParamChangeText(e) {
    var value = e.target.value.length > 0 ? e.target.value : null
    var param_to_change = e.target.name;
    this.props.dispatch(approvalLimitsActions.modifyParams(param_to_change, value));
  }

  handleAddLimit(data) {
    const { employee, form } = this.props;
    const employee_name = form.NewApprovalLimitForm.values.employee.label;
    const cost_centre_id = parseInt(form.NewApprovalLimitForm.values.cost_centre_id.value);
    const approvalLimit  = {
      manager_name: employee_name,
      employee_id: form.NewApprovalLimitForm.values.employee.value,
      approval_limit: parseFloat(data.amount),
      cost_centre_id: cost_centre_id,
    }
    this.props.dispatch(approvalLimitsActions.addApprovalLimit(approvalLimit)).then((res) => {
      if (res.type === "ADD_APPROVAL_LIMIT_SUCCESS") {
        toastr.removeByType("error")
        toastr.success('Approval Authority Added', 'Added a new approval limit for ' + employee_name + '.', toastrHelpers.getSuccessOptions())
        modal.clear();
      } else {
        toastr.removeByType("error");
        toastr.error('Duplicate Entry', employee_name +  ' already has approval authority for cost centre ' + cost_centre_id + '.', toastrHelpers.getErrorOptions())
      }
    });;
  }

  showNewApprovalLimitModal() {
    modal.add(NewApprovalLimitModal, {
      title: 'Assign Approval Authority',
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false ,// (optional) Switch to true if you want to close the modal by clicking outside of it,
      hideTitleBar: false ,// (optional) Switch to true if do not want the default title bar and close button,
      hideCloseButton: false, // (optional) if you don't wanna show the top right close button
      //.. all what you put in here you will get access in the modal props ;)
      onSubmitFunction: this.handleAddLimit,
      cost_centres: this.props.cost_centres,
      employees: this.props.users
    });
  }

  renderSearchByEmployeeOrCostCentre() {
    return (
      <div className="approval-limits-filter-container">
        <div className="approval-limits-filter-row">
          <div className="approval-limits-search"><label>Filter by Employee:</label></div>
          <div className="form-group approval-limits-search">
            <input type="text" className="form-control" name="employee_name" id="reports-search-manager" placeholder="First or Last Name" onChange={this.handleParamChangeText}/>
          </div>
          <div className="approval-limits-search"><label>or Cost Centre:</label></div>
          <div className="form-group approval-limits-search">
            <input type="text" className="form-control" name="cost_centre_id" id="reports-search-employee" placeholder="Cost Centre #" onChange={this.handleParamChangeText}/>
          </div>
          <div className="approval-limits-button">
            <div className="padded-buttons-row">
              <button className="page-button" onClick={this.showNewApprovalLimitModal}> New Approval Authority </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="claimlist-container">
        <div className="page-header">
          <div className="page-title">
           Approval Authorities
          </div>
          <div className="page-route">
            <span className="route-inactive">Home > Admin</span>  <span className="route-active"> > Approval Authorities</span>
          </div>
        </div>
        { this.renderSearchByEmployeeOrCostCentre() }
        <ApprovalLimitsList />
      </div>
      )
  }
}

function mapStateToProps(state) {
  const { authentication, policies, form, employees } = state;
  const { employee } = authentication;
  const { managerOptions, params, cost_centres } = policies;
  const users = employees.employees;
  return {
    form,
    employee,
    managerOptions,
    params,
    cost_centres,
    users,
  };
}

export default withRouter(connect(mapStateToProps)(ApprovalLimitsContainer))