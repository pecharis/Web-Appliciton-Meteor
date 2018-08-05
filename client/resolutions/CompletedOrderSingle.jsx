import React, {Component} from 'react';

export default class CompletedOrderSingle extends Component {

	toggleChecked() {
	//	Meteor.call('toggleDeliverOrder', this.props.resolution);
	//	if(this.props.resolution.paid===true){
	//		Meteor.call('toggleCompleteOrder',this.props.resolution);
	//	}
	}

	

	render () {
		const resolutionClass = this.props.resolution.status ? "pending" : "";
		const status= this.props.resolution.status ? <span className="completed">delivered</span> : '';
		const resolutionClass2 = this.props.resolution.paid ? "false" : "";
		const status2= this.props.resolution.paid ? <span className="completed">paid</span> : '';
		var single;
		if(this.props.resolution.completed===true){
			single=<div>
				<li className={resolutionClass}>
				<input type="checkbox"
					readOnly={true}
					id={this.props.resolution._id}
					checked={this.props.resolution.status}
					onClick={this.toggleChecked.bind(this)} />
				<label className="testlabel" onClick={this.toggleChecked.bind(this)}> table number : {this.props.resolution.table_number} {" "}
				order taken at {moment(this.props.resolution.last_modified).format("DD/MM/YYYY HH:mm")} {" "}
				{status}{status2}</label>
			</li>
			</div>
		}
		return (
			<ul>
			{single}
			</ul>
			)
	}
}