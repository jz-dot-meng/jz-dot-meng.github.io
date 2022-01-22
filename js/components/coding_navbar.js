const nav = document.getElementById('navbar');

const datafile = '../js/data/navbar_data.xml'

const _init = () => {
    // create ul
    const list = document.createElement('ul');
    list.setAttribute('id', 'navlist');
    nav.appendChild(list);

    // load xml file
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {

        // Request finished and response 
        // is ready and Status is "OK"
        if (this.readyState == 4 && this.status == 200) {
            populateNav(this)
        }
    };

    // employee.xml is the external xml file
    xmlhttp.open("GET", datafile, true);
    xmlhttp.send();
}
_init();

const populateNav = (xml) => {
    const list = document.getElementById('navlist');

    // xml manipulation
    const xmlDoc = xml.responseXML;
    const dropdowns = xmlDoc.getElementsByTagName('dropdown');

    for (let i = 0; i < dropdowns.length; i++) {
        // create a list item, append to ul
        const li = document.createElement('li');
        list.append(li);
        // create div class dropdown, append to li
        const ddDiv = document.createElement('div');
        ddDiv.setAttribute('class', 'dropdown');
        li.appendChild(ddDiv);
        // create a element with dropdown name
        const a = document.createElement('a');
        a.innerHTML = dropdowns[i].getAttribute('name');
        ddDiv.appendChild(a);
        // create div class dropdowncontent
        const ddContent = document.createElement('div');
        ddContent.setAttribute('class', 'dropdownContent');
        ddDiv.append(ddContent);

        // inner loop for pages
        const pages = dropdowns[i].children;

        for (let j = 0; j < pages.length; j++) {
            // create a element
            const page = document.createElement('a');
            page.setAttribute('href', pages[j].getAttribute('link'))
            page.innerHTML = pages[j].getAttribute('title');
            // append to ddContent
            ddContent.appendChild(page);
        }
    }

}