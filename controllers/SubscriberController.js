var Subscriber = require('../models/Subscriber.js')
var mongoose = require('mongoose')
var Promise = require('bluebird')


// - - - - - - - - - - - - - - - - - - - - HELPER METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function convertToJson(subscribers){
	var results = new Array()
    for (var i=0; i<subscribers.length; i++){
  	  var p = subscribers[i]
  	  results.push(p.summary())
    }
	
	return results
}

module.exports = {
	pluralKey: function(){
		return 'subscribers'
	},

	get: function(params, completion){

		// fetch specific Course by ID:
		if (params.id != null){ 
			Subscriber.findById(params.id, function(err, subscriber){
				if (err){
					completion({message:'Subscriber '+params.id+' not found'}, null)
					return
				}
				
				if (subscriber == null){
					completion({message:'Subscriber '+params.id+' not found'}, null)
					return
				}

				completion(null, subscriber.summary())
			})
			return
		}
		
		
		/* Query by filters passed into parameter string: */
		var limit = params.limit
		if (limit == null)
			limit = '0'
		
		delete params['limit']

		var format = 'json'
		if (params['format'] != null){
			format = params['format'] // list or csv
			delete params['format']
		}
		
		Subscriber.find(params, null, {limit:parseInt(limit), sort:{timestamp: -1}}, function(err, subscribers) {
			if (err) {
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			if (format == 'list' || format == 'string'){
				var list = []
				for (var i=0; i<subscribers.length; i++){
					var subscriber = subscribers[i]
					var email = subscriber.email.toLowerCase()
					if (list.indexOf(email) != -1) // already there, duplicate
						continue
					
					if (email.length == 0) // empty string
						continue

					if (email.indexOf('@') == -1) // invalid email
						continue

					list.push(email)
				}

				if (format == 'list')
					completion(null, list)

				if (format == 'string')
					completion(null, list.join(','))

				return
			}

			// if (format == 'csv'){
			// 	var csv = 'Name,Email,Workshop,Timestamp,Goal,Interested\n'
			// 	for (var i=0; i<subscribers.length; i++){
			// 		var subscriber = subscribers[i]
			// 		var workshop = subscriber.workshop
			// 		if (workshop != null){
			// 			workshop = workshop.replace(', ', '+')
			// 			workshop = workshop.replace(', ', '+')
			// 		}

			// 		var goal = ''
			// 		var interested = ''
			// 		var survey = subscriber.survey
			// 		for (var j=0; j<survey.length; j++){
			// 			var reply = survey[j]
			// 			if (reply.question == 'goal')
			// 				goal = reply.response

			// 			if (reply.question == 'interest in Velocity')
			// 				interested = reply.response

			// 		}

			// 		csv = csv+subscriber.name+','+subscriber.email+','+workshop+','+subscriber.timestamp+','+goal+','+interested+'\n'
			// 	}

			// 	completion(null, csv)
			// 	return
			// }


			completion(null, convertToJson(subscribers))
		})
	},

	post: function(subscriberInfo, completion){
		Subscriber.find({email:subscriberInfo.email}, function(err, subscribers){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}

			if (subscribers.length > 0){ // subscriber with email already exists - send it back
				var subscriber = subscribers[0]
				completion(null, subscriber.summary())
				return
			}

			// Create new subscriber. This is what should happen:
			Subscriber.create(subscriberInfo, function(err, subscriber){
				if (err){
					completion({confirmation:'fail', message:err.message}, null)
					return
				}

				if (completion != null)
					completion(null, subscriber.summary())
				
				return
			})
		})
	},

	put: function(subscriberId, subscriberInfo, completion){
		Subscriber.findByIdAndUpdate(subscriberId, subscriberInfo, {new:true}, function(err, subscriber){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, subscriber.summary())
			return
		})
	},

	delete: function(params, completion){
		Subscriber.find(params, function(err, subscribers){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}

			for (var i=0; i<subscribers.length; i++){
				var subscriber = subscribers[i]
				subscriber.remove()				
			}

			completion(null, null)
		})
	}

	// currentVisitor: function(req){
	//     return new Promise(function (resolve, reject){
	// 		if (req.session == null){
	// 			resolve(null)
	// 			return
	// 		}

	// 		if (req.session.visitor == null){
	// 			resolve(null)
	// 			return
	// 		}

	// 		var subscriberId = req.session.visitor
	// 		Subscriber.findById(subscriberId, function(err, subscriber){
	// 			if (err){
	// 				resolve(null)
	// 				return
	// 			}
				
	// 			if (subscriber == null){
	// 				resolve(null)
	// 				return
	// 			}

	// 			resolve(subscriber.summary())
	// 		})
	//     })
	// }	

}



