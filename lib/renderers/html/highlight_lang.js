
// Highlight a string with tokens like :this and $that
// Used to highlight parameters in Restify routes

exports.tokens = {

  case_insensitive: true,
  keywords: '',
  literal: '',

  contains: [
    {
      className: 'attribute',
      begin: ':', end: '[^\\/?]+'
    },
    {
      className: 'attribute',
      begin: '\\$', end: '[^&]+'
    }
  ]

};
