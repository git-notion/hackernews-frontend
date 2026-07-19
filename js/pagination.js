function updatePaginationUI(){
    const total=Math.ceil(data.length/ppg)
    document.getElementById('page-info').textContent=`${currPage}/${total}`
    document.getElementById("prev").disabled = currPage === 1;
    document.getElementById("next").disabled = currPage === total;
}
document.getElementById("prev").addEventListener("click", async () => {
    if (currPage > 1) {
        currPage--;
        await renderPage();
    }
});
document.getElementById("next").addEventListener("click", async () => {
    const totalPages = Math.ceil(data.length / ppg);

    if (currPage < totalPages) {
        currPage++;
        await renderPage();
    }
});