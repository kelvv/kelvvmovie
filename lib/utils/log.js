const log4js 	= require( 'log4js' );
const json 		= require( '../config/log.json' );

log4js.configure( { appenders:json } );

module.exports = {
	get: name => {
		const logger = log4js.getLogger( name );
		logger.setLevel( 'INFO' );
		/*eslint-disable*/
		if (process.env.DEBUG) logger.setLevel('TRACE');
		/*eslint-enable*/
		return logger;
	}
};
