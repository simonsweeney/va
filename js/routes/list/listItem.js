var { DB_ROOT } = require('../../config');

module.exports = data => {
    
    return `
    
        <div class="grid__item grid__item_fade-in">
            <img src="${DB_ROOT + '/img/' + data.id}">
            <a href="${data.id}"></a>
        </div>
    
    `
    
}