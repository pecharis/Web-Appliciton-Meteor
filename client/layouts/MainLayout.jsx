import React from 'react';
import { Meteor } from 'meteor/meteor'
import AccountsUI from '../AccountsUI.jsx';


export const MainLayout = ({content}) => (



	<div className="main-layout">
		<header>
			<h2>Business Life of Tomorrow</h2>
			<nav>
				<a href="/">Home</a>
				<a href="/analytics">Analytics</a>
				<a href="/mymenu">MyMenu</a>
				<a href="/orders">Orders</a>
				<AccountsUI />
			</nav>
		</header>
		<main>
			{content}			 
		</main>
	</div>

	

)