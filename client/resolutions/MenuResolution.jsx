import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ResolutionSingle from './ResolutionSingle.jsx';
import Collapsible from 'react-collapsible';

export default class MenuResolution extends TrackerReact(React.Component) {

	mycategories() {
		var distinctEntries = _.uniq(Mcollections.find({}, {
    		sort: {"category": 1}, fields: {"category": true}
		}).fetch().map(function(x) {
   			 return x.category;
		}), true);
		return distinctEntries;
	}

	eachcategory(distinctEntry){
		return Mcollections.find({category : distinctEntry },{sort: {"category": 1}}).fetch();
	}

	render() {
		const category_names = this.mycategories();
		const listItems = category_names.map((category_name, index) =>
 			<Collapsible key={index} className="resolutions" trigger={`${category_name}`}>
 			{this.eachcategory(category_name).map( (resolution)=>{
				return <ResolutionSingle key={resolution._id} resolution={resolution} />
					})
			}
			</Collapsible>
		);

		return(					
			 	
			<ReactCSSTransitionGroup				
       				component="ul"
					className="resolutions"
					transitionName="resolutionLoad"
					transitionEnterTimeout={600}
					transitionLeaveTimeout={400}>
					<ul>{listItems}</ul>
       			</ReactCSSTransitionGroup>       		
       	)
	}
}