'use strict';
const { add } = require('./add/index.js')
const { get } = require('./get/index.js')
const { remove } = require('./remove/index.js')
const { update } = require('./update/index.js')
global.successMsg = 'success'
global.successCode = 0
global.wrongCode = 1

exports.main = async (event, context) => {
	switch (event.type) {
		case 'add':
			return add(event)
		case 'get':
			return get(event)
		case 'update':
			return update(event)
		case 'remove':
			return remove(event)
	}
};
