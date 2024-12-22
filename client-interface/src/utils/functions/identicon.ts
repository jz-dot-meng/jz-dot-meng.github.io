//! Typescript implementation of https://github.com/stewartlord/identicon.js/blob/master/identicon.js

type IdenticonOptions = {
    background: [number, number, number, number];
    margin: number;
    size: number;
    saturation: number;
    brightness: number;
    format: string;
    foreground?: [number, number, number, number];
};

const DEFAULTS: IdenticonOptions = {
    background: [240, 240, 240, 255],
    margin: 0.08,
    size: 64,
    saturation: 0.7,
    brightness: 0.5,
    format: "svg",
};

export class Identicon {
    private options: IdenticonOptions;

    private hash: string;
    private background: [number, number, number, number];
    private size: number;
    private format: string;
    private margin: number;
    private foreground: [number, number, number, number];

    constructor(hash: string, options?: Partial<IdenticonOptions>) {
        if (typeof hash !== "string" || hash.length < 15) {
            throw "A hash of at least 15 characters is required.";
        }

        this.options = {
            ...DEFAULTS,
            ...options,
        };

        // backward compatibility with old constructor (hash, size, margin)
        this.hash = hash;
        this.background = this.options.background;
        this.size = this.options.size;
        this.format = this.options.format;
        this.margin = this.options.margin;

        // foreground defaults to last 7 chars as hue at 70% saturation, 50% brightness
        const hue = parseInt(this.hash.slice(-7), 16) / 0xfffffff;
        const saturation = this.options.saturation;
        const brightness = this.options.brightness;
        this.foreground = this.options.foreground || this.hsl2rgb(hue, saturation, brightness);
    }

    public image() {
        return new Svg(this.size, this.foreground, this.background);
    }

    // adapted from: https://gist.github.com/aemkei/1325937
    private hsl2rgb(
        hue: number,
        saturation: number,
        brightness: number
    ): [number, number, number, number] {
        const internalH = hue * 6;
        const internalS = [
            (brightness += saturation *= brightness < 0.5 ? brightness : 1 - brightness),
            brightness - (saturation % 1) * saturation * 2,
            (brightness -= saturation *= 2),
            brightness,
            brightness + (hue % 1) * saturation,
            brightness + saturation,
        ];

        return [
            internalS[~~internalH % 6] * 255, // red
            internalS[(internalH | 16) % 6] * 255, // green
            internalS[(internalH | 8) % 6] * 255, // blue
            255,
        ];
    }

    private rectangle(x: number, y: number, w: number, h: number, color: string, image: Svg) {
        image.rectangles.push({ x, y, w, h, color });
    }

    public toString(raw?: boolean) {
        // backward compatibility with old toString, default to base64
        if (raw) {
            return this.render().getDump();
        } else {
            return this.render().getBase64();
        }
    }

    public render() {
        const image = this.image();
        const size = this.size;
        const baseMargin = Math.floor(size * this.margin);
        const cell = Math.floor((size - baseMargin * 2) / 5);
        const margin = Math.floor((size - cell * 5) / 2);
        const bg = image.color(...this.background);
        const fg = image.color(...this.foreground);

        // the first 15 characters of the hash control the pixels (even/odd)
        // they are drawn down the middle first, then mirrored outwards
        let color: string;
        for (let i = 0; i < 15; i++) {
            color = parseInt(this.hash.charAt(i), 16) % 2 ? bg : fg;
            if (i < 5) {
                this.rectangle(2 * cell + margin, i * cell + margin, cell, cell, color, image);
            } else if (i < 10) {
                this.rectangle(
                    1 * cell + margin,
                    (i - 5) * cell + margin,
                    cell,
                    cell,
                    color,
                    image
                );
                this.rectangle(
                    3 * cell + margin,
                    (i - 5) * cell + margin,
                    cell,
                    cell,
                    color,
                    image
                );
            } else if (i < 15) {
                this.rectangle(
                    0 * cell + margin,
                    (i - 10) * cell + margin,
                    cell,
                    cell,
                    color,
                    image
                );
                this.rectangle(
                    4 * cell + margin,
                    (i - 10) * cell + margin,
                    cell,
                    cell,
                    color,
                    image
                );
            }
        }

        return image;
    }
}

type Rectange = { x: number; y: number; w: number; h: number; color: string };

class Svg {
    private size: number;
    private foreground: string;
    private background: string;
    public rectangles: Rectange[];

    constructor(
        size: number,
        foreground: [number, number, number, number],
        background: [number, number, number, number]
    ) {
        this.size = size;
        this.foreground = this.color(...foreground);
        this.background = this.color(...background);
        this.rectangles = [];
    }

    public color(r: number, g: number, b: number, a = 1) {
        const values: number[] = [r, g, b].map(Math.round);
        values.push(a >= 0 && a <= 255 ? a / 255 : 1);
        return "rgba(" + values.join(",") + ")";
    }

    public getDump() {
        let xml: string;
        let rect: Rectange;
        const fg = this.foreground;
        const bg = this.background;
        const stroke = this.size * 0.005;

        xml =
            "<svg xmlns='http://www.w3.org/2000/svg'" +
            " width='" +
            this.size +
            "' height='" +
            this.size +
            "'" +
            " style='background-color:" +
            bg +
            ";'>" +
            "<g style='fill:" +
            fg +
            "; stroke:" +
            fg +
            "; stroke-width:" +
            stroke +
            ";'>";

        for (let i = 0; i < this.rectangles.length; i++) {
            rect = this.rectangles[i];
            if (rect.color == bg) continue;
            xml +=
                "<rect " +
                " x='" +
                rect.x +
                "'" +
                " y='" +
                rect.y +
                "'" +
                " width='" +
                rect.w +
                "'" +
                " height='" +
                rect.h +
                "'" +
                "/>";
        }
        xml += "</g></svg>";

        return xml;
    }

    public getBase64() {
        if ("function" === typeof btoa) {
            return btoa(this.getDump());
        } else if (Buffer) {
            return Buffer.from(this.getDump(), "binary").toString("base64");
        } else {
            throw "Cannot generate base64 output";
        }
    }
}
