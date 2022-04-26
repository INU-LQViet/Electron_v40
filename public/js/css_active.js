function mainfunction(){
    var date = new Date(Date.now());
    var spanDate = document.getElementById('date');
    spanDate.innerHTML= date.toString();

    var socket = io.connect('http://localhost:18092');
    game(socket);
    plot_chart(socket);
}