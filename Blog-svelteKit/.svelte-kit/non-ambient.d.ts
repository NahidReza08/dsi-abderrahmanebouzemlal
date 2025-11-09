
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/blog" | "/blog/[slug]";
		RouteParams(): {
			"/blog/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string };
			"/blog": { slug?: string };
			"/blog/[slug]": { slug: string }
		};
		Pathname(): "/" | "/blog" | "/blog/" | `/blog/${string}` & {} | `/blog/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/Image/blog-avatar/03.png" | "/Image/blog-avatar/04.png" | "/Image/blog-avatar/05.png" | "/Image/blog-avatar/06.png" | "/Image/blog-avatar/07.png" | "/Image/blog-avatar/11.png" | "/Image/blog-avatar/12.png" | "/Image/blog-avatar/13.png" | "/Image/blog-thumbnail/01.png" | "/Image/blog-thumbnail/02.png" | "/Image/blog-thumbnail/03.png" | "/Image/blog-thumbnail/04.png" | "/Image/blog-thumbnail/05.png" | "/Image/blog-thumbnail/06.png" | "/Image/blog-thumbnail/07.png" | "/Image/blog-thumbnail/08.png" | "/Image/blog-thumbnail/09.png" | "/Image/blog-thumbnail/10.png" | "/Image/blog-thumbnail/11.png" | "/Image/blog-thumbnail/12.png" | "/Image/blog-thumbnail/13.png" | "/Image/blog-thumbnail/14.png" | "/Image/blog-thumbnail/15.png" | "/Image/blog-thumbnail/16.png" | "/Image/blog-thumbnail/17.png" | "/Image/blog-thumbnail/18.png" | "/Image/blog-thumbnail/19.png" | "/Image/blog-thumbnail/20.png" | "/Image/blog-thumbnail/21.png" | "/Image/blog-thumbnail/22.png" | "/Image/icons/icon-outline-socialmedia-instagram.svg" | "/Image/icons/icon-outline-sort-by-up-02.png" | "/Image/icons/icon-socialmedia-outline-facebook-rectangle.svg" | "/Image/icons/icon-socialmedia-outline-facebook.svg" | "/Image/icons/icon-socialmedia-outline-linkedin-rectangle.svg" | "/Image/icons/icon-socialmedia-outline-linkedin.svg" | "/Image/icons/icon-socialmedia-outline-telegram.svg" | "/Image/icons/icon-socialmedia-outline-twitter.svg" | "/Image/icons/icon-socialmedia-outline-whatsapp.svg" | "/Image/icons/icon-socialmedia-outline-x-rectangle.svg" | "/Image/icons/icon-socialmedia-outline-x.svg" | "/Image/icons/icon-socialmedia-outline-youtube.svg" | "/Image/icons/icon-socialmedia-spotify.svg" | "/Image/logo.svg" | "/favicon.svg" | "/fonts/Montserrat-Italic-VariableFont_wght.ttf" | "/fonts/Montserrat-VariableFont_wght.ttf" | "/fonts/OFL.txt" | "/fonts/README.txt" | "/fonts/StyleScript-Regular.ttf" | "/fonts/static/Montserrat-Black.ttf" | "/fonts/static/Montserrat-BlackItalic.ttf" | "/fonts/static/Montserrat-Bold.ttf" | "/fonts/static/Montserrat-BoldItalic.ttf" | "/fonts/static/Montserrat-ExtraBold.ttf" | "/fonts/static/Montserrat-ExtraBoldItalic.ttf" | "/fonts/static/Montserrat-ExtraLight.ttf" | "/fonts/static/Montserrat-ExtraLightItalic.ttf" | "/fonts/static/Montserrat-Italic.ttf" | "/fonts/static/Montserrat-Light.ttf" | "/fonts/static/Montserrat-LightItalic.ttf" | "/fonts/static/Montserrat-Medium.ttf" | "/fonts/static/Montserrat-MediumItalic.ttf" | "/fonts/static/Montserrat-Regular.ttf" | "/fonts/static/Montserrat-SemiBold.ttf" | "/fonts/static/Montserrat-SemiBoldItalic.ttf" | "/fonts/static/Montserrat-Thin.ttf" | "/fonts/static/Montserrat-ThinItalic.ttf" | string & {};
	}
}