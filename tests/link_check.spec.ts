import { test, expect, type Page } from '@playwright/test';

// How to build urls array
// Parse through the nav bar for all urls
// Use regex to obtain the page name from the url
const urls = [
    { pageName: 'homepage', url: 'https://store.convergint.com'},
    /* { pageName: 'apparel', url: 'https://store.convergint.com/en-gb/catalog/apparel'},
    { pageName: 'women', url: 'https://store.convergint.com/en-gb/catalog/apparel/women'},
    { pageName: 'men', url: 'https://store.convergint.com/en-gb/catalog/apparel/men'},
    { pageName: 'youth', url: 'https://store.convergint.com/en-gb/catalog/apparel/youth'},
    { pageName: 'collegague-welcome-kit', url: 'https://store.convergint.com/en-gb/catalog/colleague-welcome-kit'},
    { pageName: 'accessories', url: 'https://store.convergint.com/en-gb/catalog/accessories'},
    { pageName: 'golf', url: 'https://store.convergint.com/en-gb/catalog/accessories/golf'},
    { pageName: 'tech', url: 'https://store.convergint.com/en-gb/catalog/accessories/tech'},
    { pageName: 'drinkware', url: 'https://store.convergint.com/en-gb/catalog/accessories/drinkware'},
    { pageName: 'headwear', url: 'https://store.convergint.com/en-gb/catalog/accessories/headwear'},
    { pageName: 'bags', url: 'https://store.convergint.com/en-gb/catalog/accessories/bags'},
    { pageName: 'office', url: 'https://store.convergint.com/en-gb/catalog/office'},
    { pageName: 'tradeshow', url: 'https://store.convergint.com/en-gb/catalog/tradeshow'},
    { pageName: 'banners', url: 'https://store.convergint.com/en-gb/catalog/tradeshow/banners'},
    { pageName: 'brochures', url: 'https://store.convergint.com/en-gb/catalog/tradeshow/brochures'},
    { pageName: 'career-fair-giveaways', url: 'https://store.convergint.com/en-gb/catalog/tradeshow/career-fair-giveaways'},
    { pageName: 'displays', url: 'https://store.convergint.com/en-gb/catalog/tradeshow/displays'},
    { pageName: 'seasonal', url: 'https://store.convergint.com/en-gb/catalog/seasonal'},
    { pageName: 'spring', url: 'https://store.convergint.com/en-gb/catalog/seasonal/spring'},
    { pageName: 'summer', url: 'https://store.convergint.com/en-gb/catalog/seasonal/summer'},
    { pageName: 'fall', url: 'https://store.convergint.com/en-gb/catalog/seasonal/fall'},
    { pageName: 'winter', url: 'https://store.convergint.com/en-gb/catalog/seasonal/winter'},
    { pageName: 'v-and-b-posters-w-photos', url: 'https://store.convergint.com/en-gb/catalog/ctc-decor/v-and-b-posters-w-photos'},
    { pageName: 'v-and-b-posters-wo-photos', url: 'https://store.convergint.com/en-gb/catalog/ctc-decor/v-and-b-posters-wo-photos'},
    { pageName: 'vertical-market-posters-set-1', url: 'https://store.convergint.com/en-gb/catalog/ctc-decor/vertical-market-posters-set-1'},
    { pageName: 'vertical-market-posters-set-2', url: 'https://store.convergint.com/en-gb/catalog/ctc-decor/vertical-market-posters-set-2'},
    { pageName: 'ppe', url: 'https://store.convergint.com/en-gb/catalog/ppe'},
    { pageName: 'stickers', url: 'https://store.convergint.com/en-gb/catalog/stickers'},
    { pageName: 'sale', url: 'https://store.convergint.com/en-gb/catalog/sale'}, */
];

// Run tests for each page
urls.forEach(({pageName, url}) => {
    test.describe(`Checking links on ${pageName} page`, () => {
        // Pulls up the page being tested
        test.beforeEach(async ({ page }) => {
            await page.goto(url);
        });

        test('Links, dropdowns, and modals above the main black navigator menu.', async ({page}) => {
            // Red background
            const redBackground = page.locator('div.hide-on-small-only.nav-top-container');
            await expect(redBackground).toBeVisible();
    
            const linksInRedBackground = [
                { name: 'Business Cards/Envelopes', href: 'https://convergint.ccgestore.com/UserJLogin.aspx?SuccessUrl=%2fSStartProductFromSku.aspx%3fsku%3dCon'},
                { name: 'Custom Orders', href: 'https://store.convergint.com/en-gb/information/custom-orders'}
            ];
    
            const navList = redBackground.locator('ul#nav-informations');
    
            // Add physically clicking and redirecting back to original page
            for(const {name, href} of linksInRedBackground) {
                const link = navList.locator(`a:text-is("${name}")`);
    
                await expect(link).toBeVisible();
                await expect(link).toHaveAttribute('href', href);
    
                const res = await page.request.get(href);
                await expect(res).toBeOK();

                // Clicking link
                await link.click();
                await expect(page).toHaveURL(href);

                // This assumes user is signed out
                if(name === 'Business Cards/Envelopes') {
                    await expect(page).toHaveTitle('Login');
                } else {
                    await expect(page).toHaveTitle(name);
                }

                await page.goBack();
            }
    
            // Convergint home button
            const homeLink = page.locator('div.row.top-container a.brand-logo');
            const homeImage = homeLink.locator('img');
            const imageSrc = await homeImage.getAttribute('src');
    
            // Replace with a way to check if image has rendered
            await expect(homeLink).toHaveAttribute('href', '/');
            await expect(homeImage).toBeVisible();

            // Clicking link
            await homeLink.click();
            await expect(page).toHaveURL('https://store.convergint.com');
            await expect(page).toHaveTitle('Convergint Store');
            await page.goBack();
            
            // Check src is populated
            expect(imageSrc).not.toBeNull();
            expect(imageSrc).not.toBe('');
    

            // Check URL returns a valid response
            const res = await page.request.get(imageSrc ?? '');
            await expect(res).toBeOK();
        });
    
        test('Main black navigator menu.', async ({page}) => {
            // Verification of address status is too slow
            test.setTimeout(120000);

            // Background
            await expect(page.locator('div.hide-on-med-and-down.nav-bottom-container')).toBeVisible();
    
    
            // Secondary elements and links: drop down menus
            const navItems = [
                // Apparel
                { primaryName: 'Apparel', primaryHref: 'https://store.convergint.com/en-gb/catalog/apparel', dropdownId: 'dropdown1', links: [
                    { name: 'Women', href: 'https://store.convergint.com/en-gb/catalog/apparel/women' },
                    { name: 'Men', href: 'https://store.convergint.com/en-gb/catalog/apparel/men' },
                    { name: 'Youth', href: 'https://store.convergint.com/en-gb/catalog/apparel/youth' }
                ]},
                // Colleague Welcome Kit
                { primaryName: 'Colleague Welcome Kit', primaryHref: 'https://store.convergint.com/en-gb/catalog/colleague-welcome-kit'},
                // Accessories
                { primaryName: 'Accessories', primaryHref: 'https://store.convergint.com/en-gb/catalog/accessories', dropdownId: 'dropdown3', links: [
                    { name: 'Golf', href: 'https://store.convergint.com/en-gb/catalog/accessories/golf' },
                    { name: 'Tech', href: 'https://store.convergint.com/en-gb/catalog/accessories/tech' },
                    { name: 'Drinkware', href: 'https://store.convergint.com/en-gb/catalog/accessories/drinkware' },
                    { name: 'Headwear', href: 'https://store.convergint.com/en-gb/catalog/accessories/headwear' },
                    { name: 'Bags', href: 'https://store.convergint.com/en-gb/catalog/accessories/bags' }
                ]},
                // Office
                { primaryName: 'Office', primaryHref: 'https://store.convergint.com/en-gb/catalog/office' },
                // Tradeshow
                { primaryName: 'Tradeshow', primaryHref: 'https://store.convergint.com/en-gb/catalog/tradeshow', dropdownId: 'dropdown5', links: [
                    { name: 'Banners', href: 'https://store.convergint.com/en-gb/catalog/tradeshow/banners' },
                    { name: 'Brochures', href: 'https://store.convergint.com/en-gb/catalog/tradeshow/brochures' },
                    { name: 'Career Fair/Giveaways', href: 'https://store.convergint.com/en-gb/catalog/tradeshow/career-fair-giveaways' },
                    { name: 'Displays', href: 'https://store.convergint.com/en-gb/catalog/tradeshow/displays' }
                ]},
                // Seasonal
                { primaryName: 'Seasonal', primaryHref: 'https://store.convergint.com/en-gb/catalog/seasonal', dropdownId: 'dropdown6', links: [
                    { name: 'Spring', href: 'https://store.convergint.com/en-gb/catalog/seasonal/spring' },
                    { name: 'Summer', href: 'https://store.convergint.com/en-gb/catalog/seasonal/summer' },
                    { name: 'Fall', href: 'https://store.convergint.com/en-gb/catalog/seasonal/fall' },
                    { name: 'Winter', href: 'https://store.convergint.com/en-gb/catalog/seasonal/winter' }
                ]},
                // Decor
                { primaryName: 'CTC Decor', primaryHref: 'https://store.convergint.com/en-gb/catalog/ctc-decor', dropdownId: 'dropdown7', links: [
                    { name: 'V&B Posters With Photos', href: 'https://store.convergint.com/en-gb/catalog/ctc-decor/v-and-b-posters-w-photos' },
                    { name: 'V&B Posters Without Photos', href: 'https://store.convergint.com/en-gb/catalog/ctc-decor/v-and-b-posters-wo-photos' },
                    { name: 'Vertical Market Posters Set 1', href: 'https://store.convergint.com/en-gb/catalog/ctc-decor/vertical-market-posters-set-1' },
                    { name: 'Vertical Market Posters Set 2', href: 'https://store.convergint.com/en-gb/catalog/ctc-decor/vertical-market-posters-set-2' }
                ]},
                { primaryName: 'PPE', primaryHref: 'https://store.convergint.com/en-gb/catalog/ppe' },
                { primaryName: 'Stickers', primaryHref: 'https://store.convergint.com/en-gb/catalog/stickers' },
                { primaryName: 'Sale', primaryHref: 'https://store.convergint.com/en-gb/catalog/sale' }
            ];
    
            // Add physical hover, click, and redirect back
            for(const item of navItems) {
                const primaryLink = page.locator('ul#nav-categories').getByRole('link', {name: item.primaryName});
    
                // Checking visibility
                await expect(primaryLink).toBeVisible();
                await expect(primaryLink).toHaveAttribute('href', item.primaryHref);
    
                // Checking HTTP status
                const primaryRes = await page.request.get(item.primaryHref);
                await expect(primaryRes).toBeOK();

                // Manual click check
                /* await primaryLink.click();
                await expect(page).toHaveURL(item.primaryHref);
                await expect(page).toHaveTitle(item.primaryName);
                await page.goBack(); */

                if(item.links) { 
                    // Hovering to create dropdown menu
                    const dropdown = page.locator(`ul#${item.dropdownId}`);
                    await dropdown.locator('..').hover();

                    await expect(dropdown).toBeVisible();
                    
                    for(const {name, href} of item.links) {
                        const link = dropdown.locator(`li a:text-is("${name}")`);
        
                        // Visibility check
                        await expect(link).toBeVisible();
                        await expect(link).toHaveAttribute('href', href);
        
                        // Checking HTTP response status
                        const res = await page.request.get(href);
                        await expect(res).toBeOK();
                        
                        // Manual click check
                        /* await link.click();
                        await expect(page).toHaveURL(href);
                        await expect(page).toHaveTitle(name);
                        await page.goBack(); */
                    }
                }
            }
        });

        
        // Homepage only test: Social media links
        if(pageName === 'homepage') {
            test('Social media links', async ({page}) => {
                const navItems = [
                    { className: 'fa-facebook-f', href: 'https://www.facebook.com/ConvergintTechnologies/' },
                    { className: 'fa-twitter', href: 'https://twitter.com/Convergint' },
                    { className: 'fa-youtube', href: 'https://www.youtube.com/channel/UCr0L6tZlKylI2hSy39qOssw' },
                    { className: 'fa-instagram', href: 'https://www.instagram.com/convergint/' },
                    { className: 'fa-linkedin', href: 'https://www.linkedin.com/company/convergint' }
                ];
        
                for(const {className, href} of navItems) {
                    const icon = page.locator(`a i.${className}`);
                    await expect(icon).toBeVisible();
        
                    const link = await page.locator(`a i.${className}`).locator('..'); // Finding tag with address
                    await expect(link).toHaveAttribute('href', href);
        
                    // Checking HTTP response status
                    const res = await page.request.get(href);
                    expect(res.status()).toBe(200);   

                    // Manually clicking links
                    /* await link.click();
                    await expect(page).toHaveURL(href);
                    await expect(page).toHaveTitle(name);
                    await page.goBack();  */
                }
            });
        }

        test('Footer links.', async ({page}) => {
            const navItems = [
                { headerText: 'Shop', links: [
                    { text: 'Apparel', href: 'https://store.convergint.com/en-gb/catalog/apparel'},
                    { text: 'Colleague Welcome Kit', href: 'https://store.convergint.com/en-gb/catalog/colleague-welcome-kit'},
                    { text: 'Under Armour', href: 'https://store.convergint.com/en-gb/catalog/ua'},
                    { text: 'Accessories', href: 'https://store.convergint.com/en-gb/catalog/accessories'},
                    { text: 'Office', href: 'https://store.convergint.com/en-gb/catalog/office'},
                    { text: 'Tradeshow', href: 'https://store.convergint.com/en-gb/catalog/tradeshow'},
                    { text: 'Seasonal', href: 'https://store.convergint.com/en-gb/catalog/seasonal'},
                    { text: 'CTC Decor', href: 'https://store.convergint.com/en-gb/catalog/ctc-decor'},
                    { text: 'PPE', href: 'https://store.convergint.com/en-gb/catalog/ppe'},
                    { text: 'Stickers', href: 'https://store.convergint.com/en-gb/catalog/stickers'},
                    { text: 'Sale', href: 'https://store.convergint.com/en-gb/catalog/sale'}
                ]},
                { headerText: 'Information', links: [
                    { text: 'My Account', href: 'https://store.convergint.com/en-gb?route=account/account'},
                    { text: 'Business Cards/Envelopes', href: 'https://convergint.ccgestore.com/UserJLogin.aspx?SuccessUrl=%2fSStartProductFromSku.aspx%3fsku%3dCon'},
                    { text: 'Current Set Up CTC #\'s', href: 'https://store.convergint.com/en-gb/information/ctc'},
                    { text: 'Custom Orders', href: 'https://store.convergint.com/en-gb/information/custom-orders'},
                    { text: 'Request CTC Access', href: 'https://store.convergint.com/en-gb/information/request-ctc-access'},
                    { text: 'Customer Service', href: 'https://store.convergint.com/en-gb/information/customer-service'}
                ]},
            ];
    
            // Checking links for Shop and Information
            for(const {headerText, links} of navItems) {
                for(const {text, href} of links) {
                    const section = page.locator(`section:has(h2:text-is("${headerText}"))`);
                    const link = section.locator(`ul li a:text-is("${text}")`);
    
                    await expect(link).toHaveAttribute('href', href);
                    await expect(link).toBeVisible();
    
                    const res = await page.request.get(href);
                    expect(res.status()).toBe(200);
                }
            }
    
            const contactInfo = [
                { text: 'Email Us!', href: 'mailto:support@convergintstore.zendesk.com' },
                { text: '805.953.8930', href: 'tel:805.953.8930' }
            ]
    
            const contactSection = page.locator('section:has(h2:has-text("Contact Info"))'); // Does not test mobile
    
            for(const {text, href} of contactInfo) {
                const link = contactSection.locator(`a:has-text("${text}")`);
    
                await expect(link).toBeVisible();
                await expect(link).toHaveAttribute('href', href);
    
                // Is there a way to validate this?
                // const res = await page.request.get(href);
                // expect(res.status()).toBe(200);
            }
    
            // Privacy policy
            const text = page.locator('u:text-is("Privacy Policy")');
            const link = text.locator('..');

            await expect(link).toBeVisible();
            await expect(link).toHaveAttribute('href', 'https://store.convergint.com/en-gb/information/privacy');
    
            // Checking HTTP response status
            const res = await page.request.get('https://store.convergint.com/en-gb/information/privacy');
            expect(res.status()).toBe(200);  
        });
    });    
});

