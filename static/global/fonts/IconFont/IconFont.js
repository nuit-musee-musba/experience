(function (window) {
    document.addEventListener('DOMContentLoaded', () => {
        const root = document.createElement('DIV')
        root.id = 'yunser-iconfont-symbols'
        root.innerHTML = ` 
            <svg aria-hidden="true" style="position: absolute; width: 0px; height: 0px; overflow: hidden;">
                
        <symbol id="ue900-square-back" viewBox="0 0 54 54">
            

<path fill-rule="evenodd" clip-rule="evenodd" d="M20 54C8.9543 54 0 45.0457 0 34V20C0 8.9543 8.95431 0 20 0H34C45.0457 0 54 8.95431 54 20V34C54 45.0457 45.0457 54 34 54H20ZM22.3587 26.9516C22.2522 27.0505 22.2522 27.2191 22.3587 27.318L31.0195 35.3602C31.323 35.642 31.3406 36.1166 31.0588 36.4201C30.7769 36.7236 30.3024 36.7412 29.9988 36.4594L21.338 28.4172C20.5924 27.7248 20.5924 26.5447 21.338 25.8524L29.9988 17.8102C30.3024 17.5283 30.7769 17.5459 31.0588 17.8494C31.3406 18.153 31.323 18.6275 31.0195 18.9094L22.3587 26.9516Z"></path>


        </symbol>
        <symbol id="ue901-square-cross" viewBox="0 0 54 54">
            

<path fill-rule="evenodd" clip-rule="evenodd" d="M14.4419 0C6.46584 0 0 6.46584 0 14.4419V39.5581C0 47.5342 6.46584 54 14.4419 54H39.5581C47.5342 54 54 47.5342 54 39.5581V14.4419C54 6.46584 47.5342 0 39.5581 0H14.4419ZM30.5357 26.7903L39.4788 17.8472C40.4552 16.8709 40.4552 15.288 39.4788 14.3116C38.5025 13.3353 36.9196 13.3353 35.9433 14.3116L27.5296 22.7253L18.5122 13.7079C17.5359 12.7316 15.953 12.7316 14.9766 13.7079C14.0003 14.6842 14.0003 16.2671 14.9766 17.2434L23.4647 25.7315L14.9703 34.2259C13.9939 35.2022 13.9939 36.7851 14.9702 37.7614C15.9466 38.7377 17.5295 38.7377 18.5058 37.7614L26.4708 29.7964L35.2977 38.6233C36.274 39.5996 37.8569 39.5996 38.8332 38.6233C39.8095 37.6469 39.8095 36.064 38.8332 35.0877L30.5357 26.7903Z"></path>


        </symbol>
        <symbol id="ue902-square-information" viewBox="0 0 54 54">
            

<path fill-rule="evenodd" clip-rule="evenodd" d="M0 14.4419C0 6.46584 6.46584 0 14.4419 0H39.5581C47.5342 0 54 6.46584 54 14.4419V39.5581C54 47.5342 47.5342 54 39.5581 54H14.4419C6.46584 54 0 47.5342 0 39.5581V14.4419ZM30.2559 24.4885C30.2559 23.3839 29.3604 22.4885 28.2559 22.4885H23.2326C22.128 22.4885 21.2326 23.3839 21.2326 24.4885C21.2326 25.5931 22.128 26.4885 23.2326 26.4885H26.2559V39.5583C26.2559 40.6628 27.1513 41.5583 28.2559 41.5583C29.3604 41.5582 30.2559 40.6628 30.2559 39.5582V24.4885ZM30.2558 14.442C30.2558 13.3374 29.3604 12.442 28.2558 12.442C27.1512 12.442 26.2558 13.3374 26.2558 14.442V16.9536C26.2558 18.0582 27.1512 18.9536 28.2558 18.9536C29.3604 18.9536 30.2558 18.0582 30.2558 16.9536V14.442Z"></path>


        </symbol>
        <symbol id="ue903-square-check" viewBox="0 0 54 54">
            

<path fill-rule="evenodd" clip-rule="evenodd" d="M0 14.4419C0 6.46584 6.46584 0 14.4419 0H39.5581C47.5342 0 54 6.46584 54 14.4419V39.5581C54 47.5342 47.5342 54 39.5581 54H14.4419C6.46584 54 0 47.5342 0 39.5581V14.4419ZM23.9759 32.5357C24.9522 33.512 26.5351 33.512 27.5114 32.5357L37.558 22.4892C38.5343 21.5129 38.5343 19.93 37.558 18.9536C36.5816 17.9773 34.9987 17.9773 34.0224 18.9536L25.7437 27.2324L22.4882 23.9769C21.5119 23.0006 19.929 23.0006 18.9527 23.9769C17.9763 24.9532 17.9763 26.5361 18.9527 27.5124L23.9759 32.5357Z"></path>


        </symbol>
        <symbol id="ue904-home" viewBox="0 0 56 56">
            

<path d="M1 22.6509C1 21.3682 1.59278 20.1602 2.6 19.3906L25.6 1.81509C27.0222 0.728302 28.9778 0.728302 30.4 1.81509L53.4 19.3906C54.4072 20.1602 55 21.3682 55 22.6509V50.9245C55 53.1753 53.2091 55 51 55H37.5263C36.974 55 36.5263 54.5438 36.5263 53.9811V40.5321C36.5263 39.4067 35.6309 38.4943 34.5263 38.4943H21.4737C20.3691 38.4943 19.4737 39.4067 19.4737 40.5321V53.9811C19.4737 54.5438 19.026 55 18.4737 55H5C2.79086 55 1 53.1753 1 50.9245V22.6509Z" stroke-width="1.5"></path>


        </symbol>
        <symbol id="ue905-sound-off" viewBox="0 0 58 55">
            

<path d="M39.3906 2.33926L18.7038 16.1304C18.3753 16.3495 17.9893 16.4663 17.5944 16.4663L4.49999 16.4664C3.11928 16.4664 2 17.5857 2 18.9664V35.5664C2 36.9471 3.11929 38.0664 4.5 38.0664H14.8515C15.273 38.0664 15.6838 37.9332 16.0251 37.6858L42.5 18.4987V4.00336C42.5 2.40597 40.7197 1.45319 39.3906 2.33926Z"></path>


<path d="M42.5 50.5293V28.9375C42.5 28.9292 42.4904 28.9245 42.4839 28.9296L25.7202 41.8667C25.6707 41.9049 25.668 41.9787 25.7147 42.0204L30.35 46.1664L39.3906 52.1934C40.7197 53.0795 42.5 52.1267 42.5 50.5293Z"></path>


<path d="M5.375 47.9677L56 8.89839M18.7038 16.1304L39.3906 2.33926C40.7197 1.45319 42.5 2.40597 42.5 4.00336V18.4987L16.0251 37.6858C15.6838 37.9332 15.273 38.0664 14.8515 38.0664H4.5C3.11929 38.0664 2 36.9471 2 35.5664V18.9664C2 17.5857 3.11928 16.4664 4.49999 16.4664L17.5944 16.4663C17.9893 16.4663 18.3753 16.3495 18.7038 16.1304ZM42.5 50.5293C42.5 52.1267 40.7197 53.0795 39.3906 52.1934L30.35 46.1664L25.7147 42.0204C25.668 41.9787 25.6707 41.9049 25.7202 41.8667L42.4839 28.9296C42.4904 28.9245 42.5 28.9292 42.5 28.9375V50.5293Z" stroke-width="3" stroke-linecap="round"></path>


        </symbol>
        <symbol id="ue906-sound-on" viewBox="0 0 58 54">
            

<path d="M36.2692 4.00372C36.2692 2.33362 34.3433 1.39916 33.0315 2.43274L16.2522 15.6528C15.8995 15.9307 15.4635 16.0818 15.0145 16.0818L4.49998 16.0819C3.11928 16.0819 2 17.2012 2 18.5819V35.1819C2 36.5626 3.11929 37.6819 4.5 37.6819H15.0146C15.4636 37.6819 15.8996 37.833 16.2523 38.1109L33.0315 51.3308C34.3433 52.3644 36.2692 51.43 36.2692 49.7599V4.00372Z"></path>


<path d="M44.5769 35.1895C46.5331 32.8753 47.6923 29.9989 47.6923 26.8818C47.6923 23.7647 46.5331 20.8882 44.5769 18.5741M50.8077 42.4587C54.068 38.1197 56 32.7263 56 26.8818C56 21.0373 54.068 15.6439 50.8077 11.3049M33.0315 51.3308L16.2523 38.1109C15.8996 37.833 15.4636 37.6819 15.0146 37.6819H4.5C3.11929 37.6819 2 36.5626 2 35.1819V18.5819C2 17.2012 3.11928 16.0819 4.49998 16.0819L15.0145 16.0818C15.4635 16.0818 15.8995 15.9307 16.2522 15.6528L33.0315 2.43274C34.3433 1.39916 36.2692 2.33362 36.2692 4.00372V49.7599C36.2692 51.43 34.3433 52.3644 33.0315 51.3308Z" stroke-width="3" stroke-linecap="round"></path>


        </symbol>
            </svg> 
        `
        document.body.appendChild(root)
    })
})(window)