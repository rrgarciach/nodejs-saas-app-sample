/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Promoter = require('../../schemas/promoter.schema');

exports.register = function(socket) {
  Promoter.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Promoter.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('promoter:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('promoter:remove', doc);
}