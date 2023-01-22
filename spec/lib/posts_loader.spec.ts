import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import { loadPostDataFromFile as load } from "../../src/lib/posts_loader";

chai.use(chaiAsPromised);

var expect = chai.expect;

describe('validate loading', () => {
    it('empty post array is rejected', async () => {
        var result = load('./spec/lib/data/invalid_empty.json')
        await expect(result).to.be.rejectedWith(Error)
    });

    it('post data as object is rejected', async () => {
        var result = load('./spec/lib/data/invalid_object.json')
        await expect(result).to.be.rejectedWith(Error)
    });

    it('post data missing text property is rejected', async () => {
        var result = load('./spec/lib/data/invalid_no_text.json')
        await expect(result).to.be.rejectedWith(Error)
    });

    it('post data missing location property is rejected', async () => {
        var result = load('./spec/lib/data/invalid_no_location.json')
        await expect(result).to.be.rejectedWith(Error)
    });

    it('valid post data is loaded', async () => {
        var result = load('./spec/lib/data/posts_loader/valid.json')
        await expect(result).to.become([{text: 'foo', location: ['bar'], content_warning: 'baz'}])
    });
});