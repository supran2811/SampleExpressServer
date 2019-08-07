function deleteProduct(btn) {
    const prodId = btn.parentNode.querySelector('[name=id]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    fetch('/admin/product/'+prodId , {
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        btn.closest('article').remove();
    }).catch(error => {
        console.log("Error thrown",error);
    })
}