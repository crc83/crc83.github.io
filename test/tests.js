QUnit.test( "Style single word", function( assert ) {
  assert.equal(styleText("@Hello@", "@", "style-a"), "<span class=\"style-a\">Hello</span>");
});

QUnit.test( "Style two words", function( assert ) {
  assert.equal(styleText("@Hello world@", "@", "style-a"), "<span class=\"style-a\">Hello world</span>");
});