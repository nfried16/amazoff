from werkzeug.security import generate_password_hash
import csv
from faker import Faker
from random import seed
from random import randint
num_users = 100
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
    with open('Users.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Users...', end=' ', flush=True)
        for uid in range(1, num_users):
            if uid % 10 == 0:
                print(f'{uid}', end=' ', flush=True)
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
    return
def gen_prod_categories():
    with open('Category.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Categories...', end=' \n', flush=True)
        for cat in categories:
            writer.writerow([cat])
    return

    creators = []
sellers = []
def gen_sellers():
    with open('Seller.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Sellers...', end=' \n', flush=True)
        for i in range(1, 10+1):
            seller = i
            writer.writerow([seller])
            sellers.append(seller)
    return
creators = []
def gen_products(num_products):
    available_pids = []
    with open('Products.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Products...', end=' ', flush=True)
        for pid in range(1, num_products):
            if pid % 100 == 0:
                print(f'{pid}', end=' \n', flush=True)
            name = fake.sentence(nb_words=4)[:-1]
            description = 'This is a ' + name
            image = '0x02135ae4'
            category = categories[pid % 10]
            creator = (pid % 10)+1
            creators.append(creator)
            # price = f'{str(fake.random_int(max=500))}.{fake.random_int(max=99):02}'
            writer.writerow([name, description, image, category, creator])
    return available_pids
# need to use products that exist and sellers that exist
product_prices_amt = {}
def gen_seller_product():
    with open('SellerProduct.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('SellerProduct...', end=' \n', flush=True)
        for i in range(1, 2000):
            seller = i%10+1
            product = i
            price = randint(0, 200)
            amt_in_stock = randint(0, 500)
            product_prices_amt[product] = [price, amt_in_stock]
            writer.writerow([seller, product, amt_in_stock, price])
            # sellers.append(seller)
    return


# save dictionary where key= user an value = [product_id, seller_id]
order_item = {}
def gen_order_item():
    with open('OrderItem.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('OrderItem...', end=' \n', flush=True)
        for i in range(1, 2000):
            seller = i%10+1
            order_id = i
            product = i
            price = product_prices_amt[product][0]
            amt = product_prices_amt[product][1] // 10
            fulfill_date = fake.date() + fake.time()
            writer.writerow([seller, product, amt, price, order_id, fulfill_date])
            # sellers.append(seller)
    return
gen_users(num_users)
gen_prod_categories()
gen_sellers()
gen_products(num_products)
gen_seller_product()
gen_order_item()