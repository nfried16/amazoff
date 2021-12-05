from werkzeug.security import generate_password_hash
import csv
from faker import Faker
from random import seed, randint, choice
from images.images import colors

num_users = 100
num_sellers = 20
num_products = 2000
num_purchases = 2500
Faker.seed(0)
fake = Faker()
seed(1) # random number for balance
categories = ['Electronics', 'Toys', 'Games', 'Books', 'Clothing', 'Sports', 'Art', 'Camera', 'Grocery', 'Health']

def get_csv_writer(f):
    return csv.writer(f, dialect='unix')

users = []
def gen_users(num_users):
    with open('data/Users.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Users... ', end='', flush=True)
        # Sample user to use
        writer.writerow(['natty@gmail.com', generate_password_hash('12345678'), 'Nathaniel', 'Friedman', '123 Rd', 9999])
        for uid in range(2, num_users+1):
            if uid%(num_users//10)==0:
                print(f'{uid//(num_users//10)}0%', end=' ', flush=True)
            profile = fake.profile()
            email = profile['mail']
            plain_password = f'pass{uid}'
            password = generate_password_hash(plain_password)
            users.append(profile['name'])
            name_components = profile['name'].split(' ')
            firstname = name_components[0]
            lastname = name_components[-1]
            address = profile['address']
            balance = randint(0, 500)
            writer.writerow([email, password, firstname, lastname, address, balance])
        print(f'{num_users} generated')

def gen_prod_categories():
    with open('data/Category.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Categories... ', end='', flush=True)
        for cat in categories:
            writer.writerow([cat])
        print(f'{len(categories)} generated', flush=True)

sellers = []
def gen_sellers():
    with open('data/Seller.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Sellers... ', end='', flush=True)
        for i in range(1, num_sellers+1):
            seller = i
            writer.writerow([seller])
            sellers.append(seller)
        print(f'{len(sellers)} generated', flush=True)

creators = []
def gen_products(num_products):
    available_pids = []
    with open('data/Products.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Products... ', end='', flush=True)
        for pid in range(1, num_products+1):
            name = fake.sentence(nb_words=4)[:-1]
            description = 'This is a ' + name
            image = colors[pid%len(colors)]
            category = categories[pid % 10]
            creator = (pid % num_sellers)+1
            creators.append(creator)
            writer.writerow([name, description, image, category, creator])
        print(f'{num_products} generated', flush=True)

product_prices_amt = {}
def gen_seller_product():
    with open('data/SellerProduct.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('SellerProduct... ', end='', flush=True)
        for i in range(1, 2000+1):
            seller = i%num_sellers+1
            product = i
            price = randint(0, 200)
            amt_in_stock = randint(0, 500)
            product_prices_amt[product] = [price, amt_in_stock]
            writer.writerow([seller, product, amt_in_stock, price])
        print(f'{len(product_prices_amt)} generated', flush=True)

descriptions = ['loved', 'hated', 'fell in love with', 'ate', 'immediately threw away', 'never used', 'dunked on', 'was blown away by', 'bruhhhh']
def gen_seller_reviews():
    with open('data/UserReview.csv', 'w') as f:
        writer = get_csv_writer(f)
        # A few samples
        writer.writerow([15, 1, 5, 'Unbelievable experience', 'Nathaniel went above and beyond. When I received my ball a day late, he sent me 100 more for free.'])
        writer.writerow([14, 1, 5, 'Love him more than my own family members', 'I named my kids after him.'])
        writer.writerow([13, 1, 5, 'Best seller on the best platform', 'Nathaniel is like Jeff Bezos if he were incredibly chill and not bald and also very very cool.'])
        print('UserReview... ', end='', flush=True)
        for i in range(2, num_sellers+1):
            seller = i
            user_id = randint(1, 100)
            rating = randint(1, 5)
            title = fake.sentence(nb_words=4)[:-1]
            description = f'I {choice(descriptions)} this dude'
            writer.writerow([user_id, seller, rating, title, description])
        print(f'{num_sellers} generated', flush=True)

def gen_product_reviews():
    with open('data/ProductReview.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('ProductReview... ', end='', flush=True)
        for i in range(1, 2000+1):
            product = i
            user_id = randint(1, 100)
            rating = randint(1, 5)
            title = fake.sentence(nb_words=4)[:-1]
            description = f'I {choice(descriptions)} this product'
            writer.writerow([user_id, product, rating, title, description])
        print(f'{2000} generated', flush=True)

gen_users(num_users)
gen_prod_categories()
gen_sellers()
gen_products(num_products)
gen_seller_product()
gen_seller_reviews()
gen_product_reviews()