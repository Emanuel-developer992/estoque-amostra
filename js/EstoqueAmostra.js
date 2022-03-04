window.onload = function() {
    estAmost();
    graph();
    
}

//Azul - Amostra Cadastradas
var b = [0,0,0,0,0,0,0,0,0,0,0,0,0];
//Laranja - Em estoque
var o = [0,0,0,0,0,0,0,0,0,0,0,0,0];
//Vermelho - Saída de Estoque
var r = [0,0,0,0,0,0,0,0,0,0,0,0,0];

function mecanismoGraph() {

    var search = $('#info2').val();

    //---------------- Movimentação de Amostra
    var tb_name = "tb_hist_amostra";
    var tbdoc = search; 
    var tbConstraint = DatasetFactory.createConstraint("tablename", tb_name, tb_name, ConstraintType.MUST); 
    var docConstraint = DatasetFactory.createConstraint("tb_cod", tbdoc, tbdoc, ConstraintType.MUST); 
    var arrayConstraint = new Array(tbConstraint, docConstraint);
    var movement = DatasetFactory.getDataset("DSFormulariodeMovimentacaodeAmostra", null, arrayConstraint, null);

    //----------------- Cadastro de Amostra
    var c1 = DatasetFactory.createConstraint("numb_project", search, search, ConstraintType.MUST);
    var constraintsR = new Array(c1);
    var register = DatasetFactory.getDataset("DSFormulariodeCadastrodeAmostra", null, constraintsR, null);

    var nRegister = register.values.length;

    for (var i = 0; i < nRegister; i++) { 

        //Data Mov.
        var date_mov = movement.values[i].tb_date;
        date_mov = date_mov.substring(3, 5);
        //Ação
        var action = movement.values[i].tb_acao;
        if(action == "Entrada no Estoque") {
            action = 1;
        }
        else {
            action = 0;
        }
        //Valor Mov.
        var valor_mov = movement.values[i].tb_quant;

        //Valor
        var nEst = register.values[i].qnt_receb;
        //Data
        var date = register.values[i].date_receb;
        date = date.substring(5, 7);

        for (var x = 1; x <= 12; x++) {

            if (x < 10) {
                var y = "0";
                y.toString();
                x.toString();
            }
            else {
                var y = "";
            }
            var retur = 0;

            if(date_mov == y+x) {
                if(action == 0) {
                    r[x] = parseInt(valor_mov);
                    $('#saida').val(r[x]);
                }
                else {
                    retur = valor_mov;
                }
            }

            if (date == y+x) {
                b[x] = parseInt(nEst);
                $('#cadastrado').val(b[x]);
            }

           var blue = b[x];
           var orange = o[x-1];
           var red = r[x];

           var soma = orange + blue + retur - red;

           o[x] = soma;
           $('#estoque').val(o[x]);
        }
    }

    // Obtém a data/hora atual
	var data = new Date();
    var mes = data.getMonth() +1; // 0-11 (zero=janeiro)

    for (var m = mes+1; m < 13; m++) {
        b[m] = 0;
        o[m] = 0;
        r[m] = 0;
    }


    graph();

}


function graph() {

    $('#myChart').remove();
    $('#div_chart').append('<canvas id="myChart"><canvas>'); 
    

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [
                    {
                    label: "Amostra Cadastrada",
                    data: [b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], b[12]],
                    borderWidth: 2,
                    borderColor: 'rgba(41,182,246,0.85)',
                    backgroundColor: 'rgba(41,182,246,0.85)',
                },
                {
                    label: "Em Estoque",
                    data: [o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12]],
                    borderWidth: 2,
                    borderColor: 'rgba(229,136,63,0.85)',
                    backgroundColor: 'rgba(229,136,63,0.85)',
                },
                {
                    label: "Saída de Estoque",
                    data: [r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12]],
                    borderWidth: 2,
                    borderColor: 'rgba(239,83,80,0.85)',
                    backgroundColor: 'rgba(239,83,80,0.85)',
                },
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            title: {
            display: true,
            fontSize: 20,
            text: "MOVIMENTAÇÃO DE ESTOQUE"
            },
        }
    });
}

function estAmost() {

    var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeAmostra", null, null, null);

    var n = dataset.values.length;

    for (var i = 0; i < n; i++) {
        
        try{
        var opc = dataset.values[i].numb_project;
        }
        catch(e) {
        }

        $('#info2').append($('<option>', {

            value: opc,
            text: opc
        }));

    }
}


