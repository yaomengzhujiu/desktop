function Desktop(opt) {
    Desktop.that = this
    this.data = opt.data;
    this.max = opt.max;
    this.coordinate = new Map; // 用户图标的坐标
    this.init()
}
Desktop.prototype = {
    constructor: Desktop,
    init() {
        const { floor, ceil } = Math; // 解构赋值
        const max = this.max; // 一行最大图标数
        const data = this.data; // 数据总数
        const screenW = window.screen.width; // 屏幕宽度
        const space = screenW / max; // 图标宽度
        document.body.style.width = screenW + 'px';
        document.body.style.backgroundSize = screenW + 'px'
        let warp = document.createElement('ul');
        this.warp = warp;
        this.warp.className = 'warp';
        for (let i = 0; i < data; i++) {

            let left = i % max * space;
            let top = floor(i / max) * ceil(space);
            this.createIcon(left, top, space, i)
        }
        document.body.appendChild(this.warp)
    },

    createIcon(left, top, space, cont) {
        const { floor, ceil } = Math; // 解构赋值
        let li = document.createElement('li');
        let i = document.createElement('i');
        let p = document.createElement('p');
        let div = document.createElement('div');

        i.className = 'icon'
        i.style.backgroundImage = `url('./images/bg.jpg')`

        p.className = 'name'
        p.innerHTML = `${cont % 2 == 1 ? '哈哈哈哈哈哈' : 'sajksaj'}`

        div.appendChild(i)
        div.appendChild(p)
        div.className = 'icon-warp'
        div.onmouseenter = function (e) {
            this.classList.add('over')
        }
        div.onmouseleave = function (e) {
            this.classList.remove('over')
            this.classList.remove('select')
        }
        div.onclick = function (e) {
            this.classList.add('select')
        }
        div.ondblclick = function (e) {
            Desktop.that.createPopup({ x: e.clientX, y: e.clientY })
        }


        li.className = 'item';
        li.style.cssText = `width:${space}px;height:${space}px;left:${left}px;top:${top}px`;
        li.draggable = true
        li.appendChild(div)
        li.ondragend = function (e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            if (mouseX < 0 || mouseY < 0) return
            const left = floor(mouseX / space) * space;
            const top = floor(mouseY / ceil(space)) * ceil(space);

            Desktop.that.coordinate.forEach((v, k) => {
                if (floor(v.left) === floor(left) && floor(v.top) === floor(top) && k !== this) {
                    k.style.left = this.style.left
                    k.style.top = this.style.top
                    Desktop.that.coordinate.set(k, {
                        left: parseFloat(this.style.left),
                        top: parseFloat(this.style.top)
                    })
                }
            })
            this.style.left = left + 'px';
            this.style.top = top + 'px';
            Desktop.that.coordinate.set(this, {
                left,
                top
            })

        }



        this.coordinate.set(li, {
            left,
            top
        }) // 储存坐标
        this.warp.appendChild(li)

    },

    createPopup(opt) {
        const { max, min } = Math;
        let popup = document.createElement('div');
        let popupBar = document.createElement('div');
        let popupTitle = document.createElement('p');
        let delwarp = document.createElement('i');
        let cont = document.createElement('iframe');


        popupTitle.innerText = '我不是标题';

        delwarp.onclick = () => {
            document.body.removeChild(popup)
        }

        popupBar.className = 'popup-bar';
        popupBar.appendChild(popupTitle);
        popupBar.appendChild(delwarp);

        cont.src = './images/bg.jpg';
        cont.scrolling = 'no'

        popup.className = 'popup'
        popup.style.cssText = `top:${max(opt.y - 100, 0)}px;left:${max(opt.x - 100, -10)}px;`
        popup.onmousedown = (e) => {
            const downX = e.clientX;
            const downY = e.clientY;
            const offsetL = popup.offsetLeft;
            const offsetT = popup.offsetTop;
            document.onmousemove = (e) => {
                const moveL = e.clientX - downX;
                const moveT = e.clientY - downY;
                const left = offsetL + moveL + 'px';
                const top = offsetT + moveT + 'px'

                popup.style.left = left
                popup.style.top = top

            }

            document.onmouseup = () => { document.onmousemove = null }
        }

        popup.appendChild(popupBar)
        popup.appendChild(cont)
        document.body.appendChild(popup)

    },

}


const dp = new Desktop({ data: 30, max: 18 })