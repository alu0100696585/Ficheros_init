var assert = chai.assert; // Linea para realizar los asertos correspondientes

suite('Fichero INIT', function() {
    test('Comprobar carga string con corchete', function() {
        var s = "[head[e\]r]";   
        var t = lexer(s);
        assert.equal(t[0].type,'header');
    });
    test('Asignacion', function() {
        var s = "name = John ";
        var t =lexer(s);
        assert.equal(t[0].type,'nameEqualValue');
    });
    test('Error!', function() {
        var s = "hola";
        var t = lexer(s);

        assert.equal(t[0].type,'error');
    });
});