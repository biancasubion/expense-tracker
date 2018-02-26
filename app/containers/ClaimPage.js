import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { modal } from 'react-redux-modal';
import { claimItemsActions } from '../actions';
import { claimsActions } from '../actions';
import ClaimItemContainer from './ClaimItemContainer';
import NewClaimItemModal from './NewClaimItemModal';


class ClaimPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitItem = this.submitItem.bind(this);
    this.addItemModal = this.addItemModal.bind(this);
  }

  componentDidMount() {
    let claim_id = window.location.pathname.split("/")[2];
    if (claim_id != undefined) {
      this.props.dispatch(claimItemsActions.requestAll(claim_id));
      this.props.dispatch(claimsActions.requestOne(claim_id))
    }
  }

  submitItem(data) {
    let claim_id = window.location.pathname.split("/")[2];
    const { employee, form } = this.props;
    const item = {
      claim_id: parseInt(claim_id),
      description: data.description,
      amount: parseFloat(data.amount),
      comment: data.comment,
      expense_type: parseInt(data.expense_type),
      receipt: data.receipt[0],
    }
   
    this.props.dispatch(claimItemsActions.addClaimItem(item));
    this.props.dispatch(claimItemsActions.requestAll(claim_id));
    modal.clear();
  }

  addItemModal(){
    modal.add( NewClaimItemModal, {
      title: 'Add Item',
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false ,// (optional) Switch to true if you want to close the modal by clicking outside of it,
      hideTitleBar: false ,// (optional) Switch to true if do not want the default title bar and close button,
      hideCloseButton: false, // (optional) if you don't wanna show the top right close button
      //.. all what you put in here you will get access in the modal props ;)
      onSubmitItemFunction: this.submitItem
    });
  }

  renderAddItem(){
  }

  renderError(error) {
    return <div> {error} </div>
  }

  renderFetching() {
    return <div className="loader"></div>
  }
  
  addItemModal(){
    modal.add( NewClaimItemModal, {
      title: 'Add Item',
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false ,// (optional) Switch to true if you want to close the modal by clicking outside of it,
      hideTitleBar: false ,// (optional) Switch to true if do not want the default title bar and close button,
      hideCloseButton: false, // (optional) if you don't wanna show the top right close button
      //.. all what you put in here you will get access in the modal props ;)
      onSubmitItemFunction: this.submitItem
    });
  }

  renderAddItem(){
  }
  
  render() {
    const { employee, claimItems, isFetching, claimsMap, error } = this.props;
  
    if (error !== undefined) {
      return this.renderError(error);
    }

    if (isFetching === true) {
      return this.renderFetching();
    }

    let claim_id = window.location.pathname.split("/")[2];

    const claimItemsList = claimItems.claimItemsMap[claim_id] || [];
    if (claimItemsList === undefined) {
      return this.renderFetching();
    }

    if (claimsMap === undefined) {
      return this.renderFetching();
    }


    let claim = claimsMap[claim_id];
    if (claimsMap[claim_id] == undefined) {
      return this.renderFetching();
    }

    let status = claim.status

    return (
      <div className="claimlist-container">
        <div className="page-header">
          <div className="page-title">
            View Claim
          </div>
          <div className="page-route">
            <span className="route-inactive">Home</span>  <span className="route-inactive"> > View Claim</span>  <span className="route-active"> > {claim.description}</span>
          </div>
        </div>
        <div className="claim-list">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Amount (CAD)</th>
                <th scope="col">Expense Category</th>
                <th scope="col">Receipt</th>
              </tr>
            </thead>
            <tbody>
            {
              claimItemsList.map((claimItem) => {
                return <ClaimItemContainer key={claimItem.claim_item_id} employee={employee} claim_item={claimItem} />
              })
            }
            </tbody>
          </table>
          { (status == 'P') && <button className="page-button" onClick={this.addItemModal}> New Item</button> }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { authentication, claimItems, claims, form } = state;
  const { error, isFetching } = claimItems;
  const { employee } = authentication;
  const { claimsMap } = claims;
  return {
    employee,
    claimItems,
    isFetching,
    claimsMap,
    error,
    form
  };
}

export default withRouter(connect(mapStateToProps)(ClaimPage))
