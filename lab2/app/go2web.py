import sys
import ssl
import urllib.request
import urllib.parse
import html.parser


class ResponseParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.response = []

    def handle_data(self, data):
        self.response.append(data.strip())

    def get_response(self):
        return ' '.join(self.response)


def make_http_request(url):
    ssl._create_default_https_context = ssl._create_unverified_context
    try:
        response = urllib.request.urlopen(url)
        data = response.read()
        return data
    except Exception as e:
        print(f'Error making HTTP request: {e}')
        return None


def search_term(term):
    search_engine_url = 'https://www.google.com/search?q='
    search_url = search_engine_url + urllib.parse.quote(term)
    return make_http_request(search_url)


def print_help():
    help_text = '''Usage:
    go2web -u <URL>         # make an HTTP request to the specified URL and print the response
    go2web -s <search-term> # make an HTTP request to search the term using your favorite search engine and print top 10 results
    go2web -h               # show this help'''
    print(help_text)


def main():
    if len(sys.argv) < 2:
        print_help()
        return

    option = sys.argv[1]

    if option == '-u':
        if len(sys.argv) < 3:
            print('Error: URL argument is missing')
            return
        url = sys.argv[2]
        response = make_http_request(url)
        if response:
            print('Response:')
            print(response)
    elif option == '-s':
        if len(sys.argv) < 3:
            print('Error: search term argument is missing')
            return
        term = sys.argv[2]
        response = search_term(term)
        if response:
            print('Response:')
            parser = ResponseParser()
            parser.feed(response)
            print(parser.get_response())
    elif option == '-h':
        print_help()
    else:
        print('Error: Invalid command')
        print_help()


if __name__ == '__main__':
    main()