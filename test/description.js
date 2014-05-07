var should = require('should');
var tidl = require('../lib/tidl');
var assert = require("assert");
var from=require('fromjs');


describe('@description', function() {
	it('may be specified in an interface', function() {
		var idl='interface A exposes S { \n'+
		'@description "test";'+
		' }';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getDescription(),'test');
	});
	it('may be specified in an operation', function() {
		var idl='interface A exposes S { \n'+
		'int add(int x,int y){\n'+
		'@description "test";'+
		' }\n}';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getOperation('add').getDescription(),'test');
	});
	it('may be specified in a type', function() {
		var idl='interface A exposes S { \n'+
		'type Entity(int x,int y){\n'+
		'@description "test";'+
		' }\n}';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getType('Entity').getDescription(),'test');
	});
	it('may be specified in an Exception', function() {
		var idl='interface A exposes S { \n'+
		'exception Error(int x,int y){\n'+
		'@description "test";'+
		' }\n}';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getException('Error').getDescription(),'test');
	});
	it('may be specified in a event', function() {
		var idl='interface A exposes S { \n'+
		'event Added(int x,int y){\n'+
		'@description "test";'+
		' }\n}';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getEvent('Added').getDescription(),'test');
	});
	it('may be specified in an enumeration', function() {
		var idl='interface A exposes S { \n'+
		'enumeration Symbols(X,Y){\n'+
		'@description "test";'+
		' }\n}';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getEnumeration('Symbols').getDescription(),'test');
	});
	it('may contain multiple lines',function(){
		var idl='interface A exposes S { \n'+
		'@description \n"test\nline 2";'+
		' }';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getDescription(),'test\nline 2');
	});
	it('may contain comments inline',function(){
		var idl='interface A exposes S { \n'+
		'@description //comment\n/*comment*/"test\nline 2"/* comment */;//comments\n'+
		' }';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.type=='error'}).firstOrDefault();
    	assert.equal(msg,null);
    	assert.equal(res.model.Interfaces['A'].getDescription(),'test\nline 2');
	});
	it('may not be specified at the root level', function() {
		var idl=' \n'+
		'@description "test";'+
		' ';
		var res=tidl.parse(idl);
        res.should.be.an.Object;
        res.model.should.be.an.instanceOf(tidl.IdlModel);
    	var msg=from(res.messages).where(function(m){return m.code=='1001'}).firstOrDefault();
    	assert.notEqual(msg,null);
	});
	it('should report an error if the first value is not a string',function(){
		var idl='interface A exposes S { \n'+
		'@description 1.0.0;\n'+
		' }';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.code=='2003'}).firstOrDefault();
    	assert.notEqual(msg,null,'there should be an message with code 2003');
    	assert.notEqual(msg,undefined,'there should be an message with code 2003');
    	msg.type.should.be.equal('error');
    	msg.line.should.be.equal(2);
    	msg.col.should.be.equal(13);
	});
	it('should report an error if the first value is not a string',function(){
		var idl='interface A exposes S { \n'+
		'@description test;\n'+
		' }';
		var res=tidl.parse(idl);
    	var msg=from(res.messages).where(function(m){return m.code=='2003'}).firstOrDefault();
    	assert.notEqual(msg,null,'there should be an message with code 2003');
    	assert.notEqual(msg,undefined,'there should be an message with code 2003');
    	msg.type.should.be.equal('error');
    	msg.line.should.be.equal(2);
    	msg.col.should.be.equal(13);
	});
	it('should report an error for missing value',function(){
		var idl='interface A exposes S { \n'+
		'@description "test",,"test";\n'+
		' }';
		var res=tidl.parse(idl);
	  	var msg=from(res.messages).where(function(m){return m.code=='2003'}).firstOrDefault();
	  	assert.notEqual(msg,null,'there should be an message with code 2003');
	  	assert.notEqual(msg,undefined,'there should be an message with code 2003');
	  	msg.type.should.be.equal('error');
	  	msg.line.should.be.equal(2);
	  	msg.col.should.be.equal(20);
	});
	it('should report a warning more than one instance is specified in a scope'
		// ,function(){
		// var idl='interface A exposes S { \n'+
		// '@description "test";\n'+
		// '@description "test2";\n'+
		// ' }';
		// var res=tidl.parse(idl);
		// console.log(res.messages);
  		//   	var msg=from(res.messages).where(function(m){return m.code=='2003'}).firstOrDefault();
  		//   	assert.notEqual(msg,null,'there should be an message with code 2003');
  		//   	assert.notEqual(msg,undefined,'there should be an message with code 2003');
  		//   	msg.type.should.be.equal('error');
  		//   	msg.line.should.be.equal(2);
  		//   	msg.col.should.be.equal(13);
		// }
	);
	it('should report a warning if more than one values are specified'
		// ,function(){
		// 	var idl='interface A exposes S { \n'+
		// 	'@description "test","test2";\n'+
		// 	' }';
		//	var res=tidl.parse(idl);
		// 	console.log(res.messages);
		//  var msg=from(res.messages).where(function(m){return m.code=='2001'}).firstOrDefault();
	 	//  assert.notEqual(msg,null,'there should be an message with code 2003');
	 	//  assert.notEqual(msg,undefined,'there should be an message with code 2003');
	 	//  msg.type.should.be.equal('error');
	 	//  msg.line.should.be.equal(2);
	 	//  msg.col.should.be.equal(13);
		// }
	)
});