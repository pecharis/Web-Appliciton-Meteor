import React, {Component} from 'react';

export default class ResolutionSingle extends Component {

	toggleChecked() {
		Meteor.call('toggleResolution', this.props.resolution);
	}
	deleteResolution() {
		Meteor.call('deleteResolution', this.props.resolution);
	}
	updateResolution() {
		var txt;
    	var person = prompt("Name:", this.props.resolution._id);
    	if (person == null || person == "") {
	        	txt = "User cancelled the prompt.";
    	} else {
    		console.log(person);
        	Meteor.call('updateResolution', this.props.resolution, person);
    	}

	}

	render () {
		const resolutionClass = this.props.resolution.complete ? "checked" : "";
		const status= this.props.resolution.complete ? <span className="completed">Completed</span> : '';
		return (
			<li className={resolutionClass}>
				<input type="checkbox"
					readOnly={true}
					checked={this.props.resolution.complete}
					onClick={this.toggleChecked.bind(this)} />
				<a jref={`/resolutions/${this.props.resolution._id}`}>{this.props.resolution._id}</a>
				<a>   </a>
				<a>{this.props.resolution.price} €</a>
				{status}
				<button  className="btn-cancel"
					onClick={this.deleteResolution.bind(this)}>
					&times;
				</button>
				<button type="button" className="btn-text"
					onClick={this.updateResolution.bind(this)}>Upd
				</button>
			</li>
			)
	}
}