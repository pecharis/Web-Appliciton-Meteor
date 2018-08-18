import React from 'react';
import {mount} from 'react-mounter';

import {MainLayout} from './layouts/MainLayout.jsx';
import Resolutions from './resolutions/Resolutions.jsx';
import Analytics from './Analytics.jsx';
import ResolutionDetail from './resolutions/ResolutionDetail.jsx';
import MyMenu from './MyMenu.jsx';
import NewOrders from './NewOrders.jsx';
import UpdateOrders from './UpdateOrders.jsx';
import DeliverOrders from './DeliverOrders.jsx';
import PayOrders from './PayOrders.jsx';
import CompletedOrders from './CompletedOrders.jsx';
import ReadyOrders from './ReadyOrders.jsx';


Accounts.onLogin(function(){
	FlowRouter.route('/', {
	action() {
		mount(MainLayout, {
			content: (<Resolutions />)
			})
		}
});
});
Accounts.onLogout(function(){
	FlowRouter.route('/', {
	action() {
		mount(MainLayout, {
			content: (<Resolutions />)
			})
		}
});
});


FlowRouter.route('/', {
	action() {
		mount(MainLayout, {
			content: (<Resolutions />)
			})
		}
});

FlowRouter.route('/analytics', {
	action() {
		mount(MainLayout, {
			content: (<Analytics />)
			})
		}
});

FlowRouter.route('/resolutions/:id', {
	action(params) {
		mount(MainLayout, {
			content: (<ResolutionDetail id={params.id} />)
			})
		}
});

FlowRouter.route('/mymenu', {
	action() {
		mount(MainLayout, {
			content: (<MyMenu />)
			})
		}
});

FlowRouter.route('/prepareorders', {
	action() {
		mount(MainLayout, {
			content: (<ReadyOrders />)
			})
		}
});

FlowRouter.route('/orders', {
	action() {
		mount(MainLayout, {
			content: (<NewOrders />)
			})
		}
});

FlowRouter.route('/update_orders', {
	action() {
		mount(MainLayout, {
			content: (<UpdateOrders />)
			})
		}
});

FlowRouter.route('/deliver_orders', {
	action() {
		mount(MainLayout, {
			content: (<DeliverOrders />)
			})
		}
});

FlowRouter.route('/pay_orders', {
	action() {
		mount(MainLayout, {
			content: (<PayOrders />)
			})
		}
});
FlowRouter.route('/completed_orders', {
	action() {
		mount(MainLayout, {
			content: (<CompletedOrders />)
			})
		}
});