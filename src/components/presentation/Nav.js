import React, { Component } from 'react'

export default (props) => {

	return (
		<div id="page-menu">
			<div id="page-menu-wrap">
				<div className="container clearfix" style={{width:98+'%'}}>
					<div style={{fontFamily:'Pathway Gothic One',fontSize:30,fontWeight:100}} className="menu-title">
						<a style={{color:'#fff'}} href="/">Velocity 360</a>
					</div>

					<nav className="one-page-menu">
						<ul className="hidden-xs">
							<li><a href="http://turbo.velocity360.io/"><div>Turbo</div></a></li>
							<li><a href="/courses"><div>Courses</div></a></li>
							<li><a href="/"><div>Tutorials</div></a></li>
							<li>
								{ (props.user) ? <a href="/account"><div>{ props.user.username }</div></a> : <a href="/login"><div>Login</div></a> }
							</li>
							
						</ul>

						<ul className="visible-xs" style={{background:'#000'}}>
							<li><a href="#" data-href="#header"><div>Test</div></a></li>
						</ul>
					</nav>

					<div id="page-submenu-trigger"><i className="icon-reorder"></i></div>
				</div>
			</div>
		</div>
	)
}