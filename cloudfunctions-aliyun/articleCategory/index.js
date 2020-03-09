'use strict';
const { get } = require('./get')
exports.main = async (event, context) => {
	switch (event.type) {
		case 'get':
			return await get(event)
	}
};
