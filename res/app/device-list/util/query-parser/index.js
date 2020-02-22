var State = {
  TERM_START: 10
, QUERY_START: 20
, OP_LT: 30
, OP_GT: 40
, QUERY_VALUE_START: 50
, QUERY_VALUE: 60
, QUERY_VALUE_DOUBLEQUOTED: 70
}

function Term() {
  this.field = null
  this.op = null
  this.query = ''
}

Term.prototype.append = function(input) {
  this.query += input
}

Term.prototype.reset = function() {
  this.query = ''
}

function QueryParser() {
  this.terms = []
  this.currentTerm = new Term()
  this.state = State.TERM_START
}

QueryParser.parse = function(input) {
  var parser = new QueryParser()
  return parser.parse(input)
}

QueryParser.prototype.parse = function(input) {
  var chars = input.split('')
  for (var i = 0, l = chars.length; i < l; ++i) {
    this.consume(chars[i])
  }
  return this.terms
}

QueryParser.prototype.consume = function(input) {
  switch (this.state) {
  case State.TERM_START:
    if (this.isWhitespace(input)) {
      // Preceding whitespace, ignore.
      break
    }
    this.terms.push(this.currentTerm)
    this.state = State.QUERY_START
    this.consume(input)
    break
  case State.QUERY_START:
    if (this.isWhitespace(input)) {
      // Preceding whitespace, ignore.
      break
    }
    if (input === '<') {
      this.state = State.OP_LT
      break
    }
    if (input === '>') {
      this.state = State.OP_GT
      break
    }
    this.state = State.QUERY_VALUE_START
    this.consume(input)
    break
  case State.OP_LT:
    if (input === '=') {
      this.currentTerm.op = '<='
      this.state = State.QUERY_VALUE_START
      break
    }
    this.currentTerm.op = '<'
    this.state = State.QUERY_VALUE_START
    this.consume(input)
    break
  case State.OP_GT:
    if (input === '=') {
      this.currentTerm.op = '>='
      this.state = State.QUERY_VALUE_START
      break
    }
    this.currentTerm.op = '>'
    this.state = State.QUERY_VALUE_START
    this.consume(input)
    break
  case State.QUERY_VALUE_START:
    if (this.isWhitespace(input)) {
      // Preceding whitespace, ignore.
      break
    }
    if (input === '"') {
      this.state = State.QUERY_VALUE_DOUBLEQUOTED
      break
    }
    this.state = State.QUERY_VALUE
    this.consume(input)
    break
  case State.QUERY_VALUE:
    if (this.isWhitespace(input)) {
      this.concludeTerm()
      break
    }
    if (input === ':') {
      this.currentTerm.field = this.currentTerm.query
      this.currentTerm.reset()
      this.state = State.QUERY_START
      break
    }
    this.currentTerm.append(input)
    break
  case State.QUERY_VALUE_DOUBLEQUOTED:
    if (input === '\\') {
      break
    }
    if (input === '"') {
      this.concludeTerm()
      break
    }
    this.currentTerm.append(input)
    break
  }
}

QueryParser.prototype.concludeTerm = function() {
  this.currentTerm = new Term()
  this.state = State.TERM_START
}

QueryParser.prototype.isWhitespace = function(input) {
  return input === ' ' || input === '\t' || input === '\n' || input === ''
}

module.exports = QueryParser
